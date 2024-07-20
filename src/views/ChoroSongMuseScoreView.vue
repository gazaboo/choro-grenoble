<template>
    <NavBar class="top_left" />
    <div id="control">
        <div class="burger" @click="toggleControls">
            <button>
                <i class="material-icons">menu</i>
            </button>
        </div>
        <div id="control-buttons" :class="{ 'show': showControls }">
            <div class="container-fluid">
                <router-link v-for="key in this.otherKeys" :key="key" :to="{
                    name: 'ChoroSongMuseScoreView',
                    params: {
                        theme: 'melody',
                        instrument: key,
                        title: this.title,
                        author: this.author
                    },
                }">
                    MuseScore for {{ key }}
                </router-link>
            </div>

            <button>
                <i class="material-icons">format_line_spacing</i>
                Compact Mode
            </button>
        </div>
    </div>
    <iframe ref="musescore" class="musescore" :src="this.currentUrl" frameborder="0" allowfullscreen
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
        }
    },

    components: {
        NavBar
    },
    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;

        const song = this.getSong();

        console.log(song)
        this.currentUrl = song[params.theme][params.instrument];
        const currentKey = params.instrument

        this.youtube = song.youtube.filter(url => url != "");

        this.otherKeys = ['C', 'Eb', 'Bb'].filter(item => item !== currentKey);
    },

    mounted() {
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
            console.log(this.showControls)
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

a,
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
button:hover {
    background-color: $primary-color;
}

a:hover .material-icons,
button:hover .material-icons {
    color: rgb(255, 255, 255);
}

.material-icons,
.material-symbols-rounded {
    color: $primary-color;
}
</style>
