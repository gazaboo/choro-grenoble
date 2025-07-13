<template>
    <div>
        <button @click="showModal = true" class="main-container">
            <span class="song-number">{{ id + 1 }}</span>
            <h3>{{ author }}</h3>
        </button>

        <!-- <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content">
                <button class="close-btn" @click="showModal = false" aria-label="Close">
                    &times;
                </button>
                <h2>{{ author }}</h2>
                <div class="songList">
                    <ChoroLink class="result" v-for="(music, index) in this.songs" :id="index" :music="music"
                        :key="music" @click="openSelectedSong(music)" />
                </div>
            </div>
            <div v-if="selectedSong">
                <h1>Test</h1>
            </div>

        </div> -->
    </div>
</template>

<script>
import listeChoros from "@/assets/liste_totale_choros.json";
// import ChoroLink from '@/components/ChoroLink.vue';

export default {
    name: 'AuthorCard',
    props: ['author', 'id'],
    components: {
        // ChoroLink
    },
    data() {
        return {
            showModal: false,
            songs: [],
            selectedSong: null,
        }
    },
    mounted() {
        this.songs = listeChoros.data.filter(song => song.author === this.author);
    },

    methods: {
        openSelectedSong(song) {
            this.selectedSong = song;
            this.showSongModal = true;
            console.log('Selected song:', song);
        },
    }
}
</script>
<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(20, 20, 20, 0.7); // semi-transparent dark overlay
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: #2b2b2b;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80%;
    overflow: hidden;
    color: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
}

.songList {
    overflow-y: auto;
    flex: 1 1 auto;
    max-height: calc(80vh - 4rem); // adjust for modal padding and header
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #ff4444;
    cursor: pointer;
    z-index: 10;
    line-height: 1;
    padding: 0;
}

.result {
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.48);
    border: 1px solid #333;
}
</style>