<template>
    <NavBar />
    <div>
        <h1> {{ this.title }} </h1>
    </div>
    <iframe class="musescore" :src="this.url" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>

    <!-- <div v-for="video in song.youtube" :key="video">
        <iframe width="560" height="315" :src="video" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
    </div> -->
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';

export default {

    name: 'SongView',

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

        console.log("Test -------> ", this.title);
        console.log("Test -------> ", song);
        console.log("params ---> ", params);
        console.log("url ------->", this.url)
    },
    methods: {
        getSong() {
            let song = listeChoros.data.find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        }
    }
}
</script>



<style> .musescore {
     width: 80vw;
     height: 100vh;
 }

 @media screen and (max-width: 600px) {
     .musescore {
         width: 100vw;
         height: 120vh;
     }
 }
</style>