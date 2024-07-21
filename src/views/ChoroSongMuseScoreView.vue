<template>
    <NavBar class="top_left" />
    <div id="control">
        <div class="burger" @click="toggleControls">
            <button>
                <i class="material-icons">menu</i>
            </button>
        </div>
        <div id="control-buttons" :class="{ 'show': showControls }">
            <select v-model="currentKey" multiple>
                <option v-for="key in ['C', 'Eb', 'Bb']" :key="key">
                    {{ key }}
                </option>
            </select>
        </div>
    </div>
    <iframe :key="currentUrl" ref="musescore" class="musescore" :src="currentUrl" frameborder="0" allowfullscreen
        allow="autoplay; fullscreen"></iframe>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';

export default {

    name: 'ChoroSongMuseScoreView',

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

    components: {
        NavBar
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
            // You can perform any other actions here when the key changes
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

            console.log('key', key)
            this.currentKey = key;
            console.log('key', key)

            console.log('currentUrl', this.currentUrl);
            this.currentUrl = this.song[this.part][this.currentInstrument];
            console.log('currentUrl', this.currentUrl);
        },
    }
}
</script>



<style scoped lang="scss">
$primary-color: rgb(0, 189, 0);

.top_left {
    width: 10vw;
    position: fixed;
    right: 0;
}

.musescore {
    position: fixed;
    left: 0;
    top: 0;
    width: 90vw;
    height: 90vh;

    @media screen and (max-width: 600px) {
        position: absolute;
        left: 2vw;
        width: 95vw;
        height: 130vh;
    }
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
    display: none;
    transform: translateX(200px);
    transition: display 0.3s ease, transform 0.2s ease;
    display: flex;
    flex-direction: column;
    background-color: rgb(103, 218, 103);
    z-index: 9999;
    border-radius: 5%;
}

#control-buttons.show {
    display: flex;
    transform: translateX(-5px);
}

.material-icons,
.material-symbols-rounded {
    color: $primary-color;
}

option,
button {
    text-decoration: none;
    color: black;
    border: solid 2px $primary-color;
    background-color: white;
    margin: 0.25rem;
    padding: 0.1rem 0.25rem;
    cursor: pointer;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

option:hover,
button:hover {
    background-color: $primary-color;
}

option:hover .material-icons,
button:hover .material-icons {
    color: rgb(255, 255, 255);
}

.material-icons,
.material-symbols-rounded {
    color: $primary-color;
}

select {
    background-color: #0094000f;

}
</style>
