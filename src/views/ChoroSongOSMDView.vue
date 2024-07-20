<template>
  <div id="navbar-with-controls">
    <NavBar />
  </div>
  <div id="control">
    <div class="burger" @click="toggleControls">
      <button>
        <i class="material-icons">menu</i>
      </button>
    </div>
    <div id="control-buttons">
      <button @click="transposeUp">Transpose Up</button>
      <button @click="transposeDown">Transpose Down</button>
      <button @click="transposeToCLarinet">Clarinet</button>
      <button @click="transposeToSaxophone">Sax</button>
      <button @click="resetTranspose">C</button>
      <button>
        <i class="material-icons">download</i>
      </button>
      <button @click="zoomIn">
        <i class="material-icons">zoom_in</i>
      </button>
      <button @click="zoomOut">
        <i class=" material-icons">zoom_out</i>
      </button>
      <button @click="removeChords">
        <i class="material-icons">music_note</i>
      </button>
      <button @click="toggleCompactMode">
        <i class="material-icons">format_line_spacing</i>
      </button>
    </div>
  </div>

  <div v-if="isLoading || isZooming" class="loading-overlay">
    <fingerprint-spinner :animation-duration="1500" :size="100" :color="'rgb(0, 189, 0)'" />
  </div>

  <div v-show="!isZooming" id="main-container">
    <div v-show="!isZooming" ref="osmdContainer" class="osmd-container" :class="{ 'hidden': isZooming }"></div>
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
    this.url = this.song[params.theme][params.instrument];
    this.youtube = this.song.youtube.filter(url => url != "");
    this.path = `${params.instrument}/${this.song.author} - ${this.song.title} - Theme - ${params.instrument}.mxl`;
  },

  async mounted() {
    this.osmd = await this.fetchOSMDObject();

    this.osmd.Zoom = 0.75;
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
      console.log('transposing')
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
      console.log(url);

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
      const control = document.getElementById('control-buttons');
      control.classList.toggle('show', this.showControls);
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

      this.isCompactMode = !this.isCompactMode;
      if (this.osmd && this.isCompactMode) {
        this.osmd.setOptions({
          drawingParameters: "compacttight",
          spacingBetweenSystemLines: 19,
          spacingBetweenStaffLines: 1,
          pageFormat: "Endless",
          scale: 6
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
$primary-color: rgb(0, 189, 0);

#navbar-with-controls {
  display: flex;
  justify-content: space-between;
}

#main-container {
  position: relative;
  // top: -20px;
}

.osmd-container {
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
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 0) 100%);
  opacity: 1;
}

#control {
  position: fixed;
  top: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 9999;
}

#control-buttons {
  opacity: 0;
  transform: translateX(200px);
  transition: opacity 0.3s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  background-color: rgb(103, 218, 103);
  z-index: 9999;
  border-radius: 5%;
}

#control-buttons.show {
  opacity: 1;
  transform: translateX(0);
}

.material-icons {
  color: $primary-color;
}

button {
  border: solid 2px $primary-color;
  background-color: white;
  margin: 0.25rem;
  padding: 0.1rem 0.25rem;
  cursor: pointer;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background-color: $primary-color;
}

button:hover .material-icons {
  color: rgb(255, 255, 255);
}
</style>