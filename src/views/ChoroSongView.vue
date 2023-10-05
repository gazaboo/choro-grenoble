<template>
    <NavBar />
    <!-- <div>
        <h1> {{ this.title }} </h1>
    </div> -->

    <div class="filter-bar">
        <!-- <div class="filter-bar-buttons">
            <span class="filter-bar-title">Explore</span>
            <a class="custom-collapse-btn" type="button" data-bs-toggle="collapse" data-bs-target="#authors"
                aria-expanded="false" aria-controls="authors">
                Youtube
            </a>
        </div> -->
        <div class="authors-container collapse" id="authors">
            <div class="form-check form-check-inline author-link" v-for="url of this.youtube" :key="url">
                <iframe width="560" height="315" :src="url" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>
            </div>
            <div v-if="!this.youtube.length">
                No Video yet
            </div>
        </div>
    </div>
    <iframe class="musescore" :src="this.url" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';

export default {

    name: 'ChoroSongView',

    data() {
        return {
            url: "",
            title: ""
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
        this.url = song[params.theme][params.instrument];
        this.youtube = song.youtube.filter(url => url != "");
    },
    methods: {
        getSong() {
            let song = listeChoros.data.find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        },
    }
}
</script>



<style lang="scss"> .musescore {
     width: 80vw;
     height: 90vh;

     @media screen and (max-width: 600px) {
         position: absolute;
         left: 2vw;
         width: 95vw;
         height: 130vh;

     }
 }
</style>