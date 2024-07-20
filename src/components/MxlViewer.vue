<template>
    <button @click="toggleCompactMode">Compact</button>
    <button @click="zoomOut">Zoom Out</button>
    <button @click="zoomIn">Zoom In</button>
    <button @click="removeChords">Chords</button>
    <button @click="load">load</button>

    <div v-if="isLoading" class="loading-overlay">
      <fingerprint-spinner
        :animation-duration="1500"
        :size="100"
        :color="'#ff1d5e'"
      />
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
      }
    },

    async mounted() {
      this.osmd = await this.fetchMXL();
      this.toggleCompactMode();
      this.isLoading = false;
    },

    
    methods: {
      async fetchMXL() {
        try {

          const owner = 'gazaboo';
          const repo = 'choro-db';
          const encodedPath = encodeURIComponent(this.path);
          const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

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

          this.osmd.setOptions({
            autoResize: true,
            drawTitle: true,
          })

          if (this.compact) {
            this.osmd.setOptions({
              drawingParameters: "compacttight"
            })
          } 

          await this.osmd.load(fileUrl);          
          URL.revokeObjectURL(fileUrl);
          return this.osmd; 

        } catch (error) {
          console.error('Error:', error);
          this.isLoading = false;
        }
      }, 

      async zoomIn(){
        this.osmd.Zoom += 0.1;
        this.osmd.render();
        },

      load(){
          this.isLoading = true;
      },

      zoomOut(){
          this.osmd.Zoom -= 0.1;
          this.osmd.render();
      },

      removeChords(){
        const text = document.getElementsByClassName('vf-text');
          Array.prototype.map.call( text, function(el) {
            el.style.display = 'none';
          })
      },

      toggleCompactMode(){
        this.isCompactMode = !this.isCompactMode;
        if (this.osmd && this.isCompactMode) {
          this.osmd.setOptions({ drawingParameters: "compacttight" });
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
  
  <style scoped>
  .osmd-container {
    width: 100vw;
    height: 90vh; /* Adjust as needed */
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

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>