<template>
    <button @click="toggleCompactMode">compact</button>
    <div>
      <div ref="osmdContainer" class="osmd-container"></div>
    </div>
  </template>
  
  <script>
  import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
  import JSZip from 'jszip';

  export default {
    name: 'MxlViewer',
    props: {
      path: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        osmd: null,
        fileName: ''
      }
    },

    mounted() {
      this.fetchAndDisplayMXL();
    },
    
    methods: {
      async fetchAndDisplayMXL() {
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
              // console.log(fileName)
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
          this.osmd.render();
          
          URL.revokeObjectURL(fileUrl);
        } catch (error) {
          console.error('Error:', error);
          if (error.stack) {
          console.error('Error stack:', error.stack);
        }
        }
      }, 

      toggleCompactMode(){
        this.isCompactMode = !this.isCompactMode;
        if (this.osmd && this.isCompactMode) {
          this.osmd.setOptions({ drawingParameters: "compacttight" });
        } else {
          this.osmd.setOptions({ 
            drawingParameters: "default"

            // Pur enlever les chords : 
            // https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/develop/src/MusicalScore/Graphical/EngravingRules.ts
            // this.RenderChordSymbols = true;
            // Faut aller voir comment on fait, j'ai copié vite fait pour pas oublier
          });
        }
        this.osmd.render();
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
  </style>