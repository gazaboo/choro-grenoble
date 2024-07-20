<template>
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

  <div>
    <div ref="osmdContainer" class="osmd-container"></div>
  </div>
</template>

<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import JSZip from 'jszip';
import { FingerprintSpinner } from 'epic-spinners'


export default {
  name: 'MxlViewer',
  components: {
    FingerprintSpinner
  },

  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      osmd: null,
      fileName: '',
      isLoading: true,
      showControls: false,
      mxmlCache: {},
    }
  },

  async mounted() {
    this.osmd = await this.fetchMXL();
    this.osmd.render();
    this.isLoading = false;
  },


  methods: {
    async fetchMXL() {

      const owner = 'gazaboo';
      const repo = 'choro-db';
      const encodedPath = encodeURIComponent(this.path);
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

      if (this.mxmlCache[url]) {
        return this.mxmlCache[url];
      } else {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          this.fileName = data.name;

          // Decode the Base64 content
          const binaryString = atob(data.content);

          // Convert binary string to Uint8Array
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Decompress the MXL file
          const zip = new JSZip();
          const zipContents = await zip.loadAsync(bytes);

          let xmlFile;
          for (const fileName in zipContents.files) {
            if (fileName.endsWith('.musicxml') || fileName.endsWith('.mxml')) {
              xmlFile = zipContents.files[fileName];
              break;
            }
          }

          this.mxlContent = await xmlFile.async('string');
          const blob = new Blob([this.mxlContent], { type: 'application/xml' });
          const fileUrl = URL.createObjectURL(blob);

          this.osmd = new OpenSheetMusicDisplay(this.$refs.osmdContainer);
          await this.osmd.load(fileUrl);

          this.osmd.Zoom = 0.75;
          this.osmd.setOptions({
            autoResize: true,
            drawTitle: true,
            drawingParameters: "compacttight",
          })

          this.osmd.updateGraphic();
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
      if (this.showControls) {
        control.classList.add('show');
      } else {
        control.classList.remove('show');
      }
    },

    async zoomIn() {
      this.osmd.Zoom += 0.1;
      this.osmd.render();
    },

    zoomOut() {
      this.osmd.Zoom -= 0.1;
      this.osmd.render();
    },

    removeChords() {
      const text = document.getElementsByClassName('vf-text');
      Array.prototype.map.call(text, function (el) {
        el.style.display = 'none';
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