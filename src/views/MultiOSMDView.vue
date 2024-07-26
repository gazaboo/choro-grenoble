<template>
    <div class="button-container">
        <button @click="zoomOut" :disabled="activeIndex === 0 || isRendering"
            :style="{ background: isRendering ? getProgressGradient('left') : '' }">
            Zoom Out
        </button>
        <button @click="zoomIn" :disabled="activeIndex === osmdContainers.length - 1 || isRendering"
            :style="{ background: isRendering ? getProgressGradient('right') : '' }">
            Zoom In
        </button>
    </div>
    <div class="osmd-wrapper">
        <div v-for="(container, index) in osmdContainers" :key="index" :ref="container.ref" class="osmd-container"
            :class="{ 'active-sheet': index === activeIndex }"></div>
    </div>
</template>
<script>
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import JSZip from 'jszip';

export default {
    name: 'MultiOSMDView',

    data() {
        const containerCount = 5;
        return {
            osmdContainers: Array.from({ length: containerCount }, (_, i) => ({
                ref: `osmdContainer${i + 1}`,
                zoom: 0.15 + (i * 0.15) // This will create zoom levels of 0.5, 0.75, and 1.0
            })),
            osmdObjects: [],
            activeIndex: 0,
            renderProgress: 0,
            isRendering: false
        }
    },

    async mounted() {
        let fileName = "C/Altamiro Carrilho - Deixe o breque prá mim - Theme - C.mxl";
        this.isRendering = true;

        for (let container of this.osmdContainers) {
            const osmd = await this.fetchOSMDObject(fileName, container.ref);
            osmd.Zoom = container.zoom;
            osmd.setOptions({
                // backend: "svg",
                autoResize: true,
                drawTitle: false,
                drawingParameters: "compacttight",
            });
            osmd.render();
            this.osmdObjects.push(osmd);
            this.renderProgress = (this.osmdObjects.length / this.osmdContainers.length) * 100;

        }
        this.isRendering = false;

        // window.addEventListener('resize', this.handleResize);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        async fetchOSMDObject(fileName, refName) {
            const owner = 'gazaboo';
            const repo = 'choro-db';
            const encodedPath = encodeURIComponent(fileName);
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

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

                const osmd = new OpenSheetMusicDisplay(this.$refs[refName][0]);
                await osmd.load(fileUrl);

                URL.revokeObjectURL(fileUrl);

                return osmd;

            } catch (error) {
                console.error('Error:', error);
            }
        },

        zoomIn() {
            if (this.activeIndex < this.osmdContainers.length - 1) {
                this.activeIndex++;
            }
        },

        zoomOut() {
            if (this.activeIndex > 0) {
                this.activeIndex--;
            }
        },

        async handleResize() {
            // Render the active OSMD object first
            if (this.osmdObjects[this.activeIndex]) {
                await this.osmdObjects[this.activeIndex].updateGraphic();
                await this.osmdObjects[this.activeIndex].render();
            }

            // Then render the rest of the OSMD objects
            for (let index = 0; index < this.osmdObjects.length; index++) {
                if (index !== this.activeIndex) {
                    await this.osmdObjects[index].render();
                }
            }
        },

        getProgressGradient(side) {
            const color = '#4CAF50'; // Progress color
            const transparent = 'transparent';
            if (side === 'left') {
                return `linear-gradient(to right, ${color} ${this.renderProgress}%, ${transparent} ${this.renderProgress}%)`;
            } else {
                return `linear-gradient(to left, ${color} ${this.renderProgress}%, ${transparent} ${this.renderProgress}%)`;
            }
        }
    }
}
</script>



<style>
.osmd-wrapper {
    position: relative;
    width: 100vw;
    height: 70vh;
    overflow: scroll;
}

.osmd-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.active-sheet {
    opacity: 1;
    z-index: 1;
}

.progress-bar {
    flex-grow: 1;
    height: 30px;
    background-color: #f0f0f0;
    margin: 0 10px;
    border-radius: 15px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
}

button {
    min-width: 100px;
    padding: 10px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
