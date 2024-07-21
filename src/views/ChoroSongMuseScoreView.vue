<template>
    <div id="control">
        <button class="burger" @click="toggleControls">
            <i class="material-icons">menu</i>
        </button>
        <div id="control-buttons" :class="{ 'show': showControls }">
            <select v-model="currentKey" multiple>
                <option v-for="key in ['C', 'Eb', 'Bb']" :key="key">
                    {{ key }}
                </option>
            </select>

            <router-link :to="{ name: 'ChoroSongListView' }">
                <i class="material-icons">arrow_back</i>
                <span class="role"> Return to List </span>
            </router-link>
        </div>
    </div>
    <iframe :key="currentUrl" ref="musescore" class="musescore" :src="currentUrl" frameborder="0" allowfullscreen
        allow="autoplay; fullscreen"></iframe>
</template>

<script>

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
            this.currentKey = key;
            this.currentUrl = this.song[this.part][this.currentInstrument];
        },
    }
}
</script>



<style scoped lang="scss">
$primary-color: rgb(0, 189, 0);


body {
    filter: blur(5px)
}

.musescore {
    position: fixed;
    left: 0;
    top: 0;
    width: 90vw;
    height: 100vh;
}

@media screen and (max-width: 600px) {
    .musescore {
        position: absolute;
        left: -8px;
        top: -8px;
        width: 102vw;
        height: 100vh;
    }
}

#control {
    position: fixed;
    top: 5px;
    right: 5px;
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
    font-size: 1.5rem;
}

a,
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

a:hover,
option:hover,
button:hover {
    background-color: $primary-color;
}

a:hover .material-icons option:hover .material-icons,
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
