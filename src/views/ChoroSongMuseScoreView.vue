<template>
    <NavBar :title="title" :author="author" />
    <div class="iframe-container">
        <iframe :key="currentUrl" ref="musescore" class="musescore" :src="currentUrl" frameborder="0" allowfullscreen
            allow="autoplay; fullscreen"></iframe>
    </div>
</template>

<script>

import listeChoros from "../assets/liste_totale_choros.json";
import NavBar from "@/components/NavBar.vue";
import { useRoute } from 'vue-router';

export default {

    name: 'ChoroSongMuseScoreView',
    components: {
        NavBar,
    },

    data() {
        return {
            url: "",
            title: "",
            otherKeys: [],
            showControls: false,
            currentKey: 'C',
            part: "melody",
        }
    },

    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;
        this.song = this.getSong();
        this.part = params.theme;
        this.currentUrl = this.song[params.theme][params.instrument];
        this.currentKey = params.instrument;
        this.youtube = this.song.youtube.filter(url => url != "");
    },
    computed: {
        currentUrl() {
            return this.song[this.part][this.currentKey];
        },
    },
    watch: {
        currentKey(newKey) {
            console.log('Current key changed to:', newKey);
        }
    },

    methods: {
        getSong() {
            let song = listeChoros.data.find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        },
        toggleControls() {
            this.showControls = !this.showControls;
        },

        updateMuseScore(key) {
            this.currentKey = key;
            this.currentUrl = this.song[this.part][this.currentInstrument];
        },
    }
}
</script>



<style scoped lang="scss">
.musescore {
    width: 95vw;
    height: 85vh;
    box-shadow: 2px 5px 8px rgba(255, 255, 255, 0.215); // Subtle shadow for depth
}

.iframe-container {
    display: flex;
    justify-content: center;
}

a,
option,
button {
    text-decoration: none;
    color: black;
    border: solid 2px $secondary-text-color;
    background-color: white;
    margin: 0.25rem;
    padding: 0.1rem 0.25rem;
    cursor: pointer;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

a:hover,
option:hover,
button:hover {
    background-color: $secondary-text-color;
}

select {
    background-color: #0094000f;
}
</style>
