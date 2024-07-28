<template>
    <div class="main-wrappper-navbar">

        <div id="navbar-with-burger">
            <span v-if="compact" class="song-info">
                <NavBar :showHome="false" :showInfo="false" :title="this.title" :author="this.author" />
            </span>
            <span v-else>
                <NavBar :showHome="false" :showInfo="false" />
            </span>
            <button class="burger" @click="toggleControls">
                <i class="material-icons">menu</i>
            </button>
        </div>
        <div :class="['control-buttons', { expanded: showControls }]">
            <button @click="zoomOut" :disabled="activeIndex === 0 || isRendering"
                :style="{ background: isRendering ? getProgressGradient('left') : '' }">
                Zoom Out
            </button>
            <button @click="zoomIn" :disabled="activeIndex === osmdContainers.length - 1 || isRendering"
                :style="{ background: isRendering ? getProgressGradient('right') : '' }">
                Zoom In
            </button>

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
            <button @click="removeChords">
                <i class="material-icons">music_note</i>
                <span class="role">
                    Remove chords
                </span>
            </button>
        </div>
    </div>

    <div class="osmd-wrapper">
        <div v-for="(container, index) in osmdContainers" :key="index" :ref="container.ref" class="osmd-container"
            :class="{ 'active-sheet': index === activeIndex }"></div>
    </div>
</template>
<script>
import { OpenSheetMusicDisplay, TransposeCalculator } from 'opensheetmusicdisplay';
import JSZip from 'jszip';

export default {
    name: 'MultiOSMDView',

    data() {
        const containerCount = 5;
        return {
            osmdContainers: Array.from({ length: containerCount }, (_, i) => ({
                ref: `osmdContainer${i + 1}`,
                zoom: 0.5 + (i * 0.15) // This will create zoom levels of 0.5, 0.75, and 1.0
            })),
            osmdObjects: [],
            activeIndex: 0,
            renderProgress: 0,
            isRendering: false,
            transposeValue: 0,
            showControls: true
        }
    },

    async mounted() {
        this.renderAll();
        window.addEventListener('resize', this.handleResize);
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

        async renderAll() {
            let fileName = "C/Altamiro Carrilho - Deixe o breque prá mim - Theme - C.mxl";
            this.isRendering = true;

            for (let container of this.osmdContainers) {
                const osmd = await this.fetchOSMDObject(fileName, container.ref);
                osmd.Zoom = container.zoom;
                osmd.setOptions({
                    backend: "svg",
                    autoResize: false,
                    drawTitle: false,
                    drawingParameters: "compacttight",
                });
                osmd.TransposeCalculator = new TransposeCalculator();
                osmd.render();
                this.osmdObjects.push(osmd);
                this.renderProgress = (this.osmdObjects.length / this.osmdContainers.length) * 100;

            }
            this.isRendering = false;
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

        getProgressGradient(side) {
            const color = '#4CAF50'; // Progress color
            const transparent = 'transparent';
            if (side === 'left') {
                return `linear-gradient(to right, ${color} ${this.renderProgress}%, ${transparent} ${this.renderProgress}%)`;
            } else {
                return `linear-gradient(to left, ${color} ${this.renderProgress}%, ${transparent} ${this.renderProgress}%)`;
            }
        },

        async transposeToCLarinet() {
            if (this.transposeValue != 2) {
                this.isRendering = true;
                this.renderProgress = 0;
                const totalOsmd = this.osmdObjects.length;

                const transposePromises = this.osmdObjects.map((osmd, index) =>
                    this.transpose(osmd, 2)
                        .then(() => {
                            this.renderProgress = ((index + 1) / totalOsmd) * 100;
                            console.log('render progress', this.renderProgress);
                        })
                );

                await Promise.all(transposePromises);
            }
            this.isRendering = false;
        },

        async transposeToSaxophone() {
            if (this.transposeValue != 6) {
                this.isRendering = true;
                this.renderProgress = 0;
                const totalOsmd = this.osmdObjects.length;

                const transposePromises = this.osmdObjects.map((osmd, index) =>
                    this.transpose(osmd, 6)
                        .then(() => {
                            this.renderProgress = ((index + 1) / totalOsmd) * 100;
                            console.log('render progress', this.renderProgress);
                        })
                );

                await Promise.all(transposePromises);
            }
            this.isRendering = false;
        },

        resetTranspose() {
            if (this.transposeValue != 0) {
                this.transpose(0);
            }
        },

        async transpose(osmd, val) {
            this.transposeValue = val;
            // this.isLoading = true;
            osmd.Sheet.Transpose = this.transposeValue; // e.g. -2 for 2 semitones downwards
            await new Promise(resolve => setTimeout(resolve, 10));

            osmd.updateGraphic();
            osmd.render();
            this.isLoading = false;
        },

        async handleResize() {
            console.log('resize');
            const activeOsmd = this.osmdObjects[this.activeIndex];
            if (activeOsmd) {
                activeOsmd.render();
                await new Promise(resolve => setTimeout(resolve, 10));
                console.log('first rendered');
            }

            for (const [index, osmd] of this.osmdObjects.entries()) {
                if (index !== this.activeIndex) {
                    osmd.render();
                    await new Promise(resolve => setTimeout(resolve, 10));
                    console.log('render progress', index);
                }
            }
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

        toggleControls() {
            this.showControls = !this.showControls;
        },
    },
}
</script>



<style scoped lang="scss">
$primary-color: rgb(163, 124, 74);
$primary-color-lighter: rgb(237, 183, 112);

#navbar-with-burger {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: solid 2px $primary-color;
    min-width: 100px;
    margin: 0.25rem;
    padding: 0rem 0.25rem;
    border-radius: 7px;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background-color: $primary-color-lighter ;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.control-buttons {
    display: flex;
    width: 100vw;
    height: 0;
    margin-bottom: 10px;
    overflow: scroll;
    background-color: $primary-color;
    z-index: 9999;
    transition: all 0.3s ease;
}

.control-buttons.expanded {
    height: 2rem;
}

.material-icons,
.material-symbols-rounded {
    color: $primary-color;
    font-size: 1rem;
}
</style>
