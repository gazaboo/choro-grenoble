<template>
  <div class="main-wrapper-page">
    <div class="main-wrappper-navbar">
      <div id="navbar-with-burger">
        <span v-if="compact" class="song-info">
          <NavBar class="navbar" :title="this.title" :author="this.author" />
        </span>
        <span v-else>
          <NavBar :showHome="false" :showInfo="false" />
        </span>

        <button class="burger" @click="toggleControls">
          <span class="material-symbols-outlined">
            handyman
          </span>
        </button>
      </div>

      <div :class="['control-buttons', { expanded: showControls }]">
        <router-link :to="{ name: 'ChoroSongListView' }">
          <i class="material-icons">arrow_back</i>
          <span class="role"> Return to List </span>
        </router-link>
        <button @click="transposeToCLarinet">
          <i class="material-icons">air</i>
          <span class="role">Clarinet Version</span>
        </button>
        <button @click="transposeToSaxophone">
          <i class="material-icons">air</i>
          <span class="role">
            Sax Version
          </span>
        </button>
        <button @click="resetTranspose">
          <i class="material-symbols-rounded">
            cadence
          </i>
          <span class="role">
            C Version
          </span>
        </button>
        <button @click="zoomIn">
          <i class="material-icons">zoom_in</i>
          <span class="role">
            Zoom In
          </span>
        </button>
        <button @click="zoomOut">
          <i class=" material-icons">zoom_out</i>
          <span class="role">
            Zoom Out
          </span>
        </button>
        <button @click="transposeUp">
          <span class="material-symbols-rounded">
            arrow_warm_up
          </span>
          <span class="role">
            Transpose Up
          </span>
        </button>
        <button @click="transposeDown">
          <span class="material-symbols-rounded">
            arrow_cool_down
          </span>
          <span class="role">
            Transpose Down
          </span>
        </button>
        <button>
          <i class="material-icons">download</i>
          <span class="role">
            Download
          </span>
        </button>
        <button @click="removeChords">
          <i class="material-icons">music_note</i>
          <span class="role">
            Remove chords
          </span>
        </button>
        <button @click="toggleCompactMode">
          <i class="material-icons">format_line_spacing</i>
          <span class="role">
            Compact Mode
          </span>
        </button>
      </div>
    </div>

    <div v-if="isLoading || isZooming" class="loading-overlay">
      <fingerprint-spinner class="loading-spinner" :animation-duration="1500" :size="100"
        :color="'rgb(163, 124, 74)'" />
    </div>

    <div v-show="!isZooming" id="main-container">
      <div v-show="!isZooming" ref="osmdContainer" class="osmd-container" :class="{ 'hidden': isZooming }"></div>
    </div>
  </div>
</template>

<script>
import { OpenSheetMusicDisplay, TransposeCalculator } from 'opensheetmusicdisplay';
import JSZip from 'jszip';
import { FingerprintSpinner } from 'epic-spinners'
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';
import listeChoros from "../assets/liste_totale_choros.json";




export default {
  name: 'ChoroSongOSMDView',

  components: {
    FingerprintSpinner,
    NavBar
  },

  data() {
    return {
      osmd: null,
      fileName: '',
      isLoading: true,
      isZooming: false,
      showControls: false,
      mxmlCache: {},
      url: "",
      title: "",
      otherUrls: [],
      path: "",
      song: undefined,
      compact: true,
      transposeValue: 0,
    }
  },

  created() {
    const route = useRoute();
    const params = route.params;
    this.title = params.title;
    this.key = params.instrument;
    this.song = this.getSong();
    this.author = this.song.author;
    this.url = this.song[params.theme][params.instrument];
    this.youtube = this.song.youtube.filter(url => url != "");
    this.path = `mxl/${params.instrument}/${this.song.author} - ${this.song.title} - Theme - ${params.instrument}.mxl`;
  },

  async mounted() {
    this.osmd = await this.fetchOSMDObject();

    this.osmd.Zoom = 1;
    this.osmd.setOptions({
      autoResize: true,
      drawTitle: false,
      drawingParameters: "compacttight",
    })

    this.osmd.TransposeCalculator = new TransposeCalculator();
    await this.osmd.render();
    this.isLoading = false;
  },


  methods: {
    async waitForOSMDInitialization() {
      while (!this.osmd || !this.osmd.Sheet) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },

    transposeUp() {
      this.transposeValue += 1;
      this.transpose(this.transposeValue);
    },


    transposeDown() {
      this.transposeValue -= 1;
      this.transpose(this.transposeValue);
    },

    transposeToCLarinet() {
      if (this.transposeValue != 2) {
        this.transpose(2);
      }
    },

    transposeToSaxophone() {
      if (this.transposeValue != 6) {
        this.transpose(6);
      }
    },

    resetTranspose() {
      if (this.transposeValue != 0) {
        this.transpose(0);
      }
    },

    async transpose(val) {
      if (this.osmd) {
        this.transposeValue = val;
        this.isLoading = true;
        this.osmd.Sheet.Transpose = this.transposeValue; // e.g. -2 for 2 semitones downwards
        await new Promise(resolve => setTimeout(resolve, 10));

        this.osmd.updateGraphic();
        this.osmd.render();
        this.isLoading = false;
      }
    },

    getSong() {
      let song = listeChoros.data.find((itemSong) =>
        itemSong.title.toLowerCase() === this.title.toLowerCase()
      );
      return song
    },

    async fetchOSMDObject() {

      const owner = 'gazaboo';
      const repo = 'choro-db';
      const encodedPath = encodeURIComponent(this.path);
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

      if (this.mxmlCache[url]) {
        return this.mxmlCache[url];
      } else {
        try {
          const response = await fetch(url);

          if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

          const data = await response.json();
          this.fileName = data.name;

          const fileContent = await fetch(data.download_url).then(res => res.arrayBuffer());

          const zip = await JSZip.loadAsync(fileContent);
          const xmlFile = Object.values(zip.files).find(file =>
            file.name.endsWith('.musicxml') || file.name.endsWith('.mxml')
          );

          this.mxlContent = await xmlFile.async('string');
          const blob = new Blob([this.mxlContent], { type: 'application/xml' });
          const fileUrl = URL.createObjectURL(blob);

          this.osmd = new OpenSheetMusicDisplay(this.$refs.osmdContainer);
          await this.osmd.load(fileUrl);

          URL.revokeObjectURL(fileUrl);

          this.mxmlCache[url] = this.osmd;
          return this.osmd;

        } catch (error) {
          console.error('Error:', error);
          this.isLoading = false;
        }
      }
    },

    toggleControls() {
      this.showControls = !this.showControls;
    },

    async zoomIn() {
      this.isLoading = true;
      this.osmd.Zoom += 0.1;

      // Obligatoire sinon le spinner n'apparait pas (je sais pas pourquoi)
      await new Promise(resolve => setTimeout(resolve, 10));

      this.osmd.render();
      this.isLoading = false;
    },

    async zoomOut() {
      this.isLoading = true;
      this.osmd.Zoom -= 0.1;

      // Obligatoire sinon le spinner n'apparait pas (je sais pas pourquoi)
      await new Promise(resolve => setTimeout(resolve, 10));

      this.osmd.render();
      this.isLoading = false;
    },

    removeChords() {
      const text = document.getElementsByClassName('vf-text');
      let visibility = undefined
      if (text[0].style.display === '' || text[0].style.display === 'none') {
        visibility = 'block';
      }
      else {
        visibility = 'none';
      }

      Array.prototype.map.call(text, function (el) {
        el.style.display = visibility;
      })
    },

    async toggleCompactMode() {

      this.isLoading = true;
      // Obligatoire sinon le spinner n'apparait pas (je sais pas pourquoi)
      await new Promise(resolve => setTimeout(resolve, 10));

      this.compact = !this.compact;
      if (this.osmd && this.compact) {
        this.osmd.setOptions({
          drawingParameters: "compacttight",
        });
        this.osmd.Zoom = 0.75;
        this.osmd.updateGraphic();
        this.osmd.render()
      } else {
        this.osmd.setOptions({
          drawingParameters: "default",
        });
        this.osmd.updateGraphic();
        this.osmd.render()
      }
      this.isLoading = false;
    }

  }
}
</script>

<style scoped lang="scss">
#navbar-with-burger {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

#main-container {
  position: relative;
  background-color: #fff;
  padding-top: 10px;
}

.navbar {
  width: 80vw;
}

.osmd-container {
  position: relative;
  width: 100vw;
  height: 90vh;
  overflow: auto;
  z-index: 0;
  opacity: 1;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 0) 100%);
  opacity: 1;
}

.burger {
  color: #000000;
  background-color: #ddad76;
  border-radius: 20px;
  border-color: #333;
  margin: 0 5px;
  margin-right: 20px;
  padding: .5rem 1rem;
  display: flex; // Ensures text is centered inside the link
  align-items: center;
  justify-content: center;
  height: 100%; // Optional: fill parent height
  text-align: center;
}

#control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 9999;
}



// .material-icons,
// .material-symbols-rounded {
//   color: $secondary-text-color;
//   font-size: 1rem;
// }

a {
  display: flex;
  text-decoration: none;
  color: $primary-text-color;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  background-color: $primary-background-color;
  margin: 0.25rem;
  padding: 0rem 0.25rem;
  cursor: pointer;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

a:hover,
button:hover {
  background-color: $secondary-background-color ;
}

a:hover .material-icons,
button:hover .material-icons,
button:hover .material-symbols-rounded {
  color: white;
}

.control-buttons {
  display: flex;
  width: 100vw;
  height: 0;
  margin-bottom: 10px;
  overflow: scroll;
  background-color: $secondary-text-color;
  z-index: 9999;
  // border-radius: 5%;
  transition: all 0.3s ease;
}


.control-buttons.expanded {
  height: 2rem;
}

.role {
  text-wrap: nowrap;
  font-size: 0.8rem;
}
</style>