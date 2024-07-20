<template>
  <NavBar />
  <div id="control">
    <div id="control-buttons">
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
    <div class="burger" @click="toggleControls">
      <button>
        <i class="material-icons">menu</i>
      </button>
    </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <fingerprint-spinner :animation-duration="1500" :size="100" :color="'rgb(0, 189, 0)'" />
  </div>

  <div id="main-container">
    <div ref="osmdContainer" class="osmd-container"></div>
  </div>
</template>

<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
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
      showControls: false,
      mxmlCache: {},
      url: "",
      title: "",
      otherUrls: [],
      path: "",
      song: undefined,
      compact: true
    }
  },

  created() {
    const route = useRoute();
    const params = route.params;
    this.title = params.title;
    this.song = this.getSong();
    this.url = this.song[params.theme][params.instrument];
    this.youtube = this.song.youtube.filter(url => url != "");
    this.path = 'C/' + this.song.author + ' - ' + this.song.title + ' - Theme - ' + params.instrument + '.mxl'

    let url = 'https://github.com/gazaboo/choro-db/raw/main/'
    if (params.instrument === 'Eb') {
      url = url + `Saxophone_Eb/${this.song.author} - ${this.song.title} - Theme - Saxophone Eb.mxl`
    } else if (params.instrument === 'Bb') {
      url = url + `Clarinet_Bb/${this.song.author} - ${this.song.title} - Theme - Clarinet Bb.mxl`
    } else if (params.instrument === 'C') {
      url = url + `C/${this.song.author} - ${this.song.title} - Theme - C.mxl`
    }
    url = url.replaceAll(' ', '%20')
    this.github = url
  },

  async mounted() {
    this.osmd = await this.fetchOSMDObject();

    this.osmd.Zoom = 0.75;
    this.osmd.setOptions({
      autoResize: true,
      drawTitle: false,
      drawingParameters: "compacttight",
    })

    this.osmd.render();
    this.isLoading = false;
  },


  methods: {

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
      const control = document.getElementById('control-buttons');
      control.classList.toggle('show', this.showControls);
    },

    zoomIn() {
      this.osmd.Zoom += 0.1;
      this.osmd.render();
    },

    zoomOut() {
      this.osmd.Zoom -= 0.1;
      this.osmd.render();
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

    toggleCompactMode() {
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
    }

  }
}
</script>

<style scoped lang="scss">
$primary-color: rgb(0, 189, 0);

#main-container {
  position: relative;
  // top: -20px;
}

.osmd-container {
  width: 100vw;
  height: 90vh;
  overflow: auto;
}


.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

#control {
  position: fixed;
  top: 0px;
  right: 0px;
  display: flex;
}

#control-buttons {
  opacity: 0;
  transform: translateX(-200px);
  transition: opacity 0.5s ease, transform 0.3s ease;
  display: flex;
  flex-direction: row;
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



/* Darker background on mouse-over */
button:hover {
  background-color: $primary-color;
}

button:hover .material-icons {
  color: rgb(255, 255, 255);
}
</style>