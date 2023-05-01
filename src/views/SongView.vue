<script setup>

import choroSongs from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';
import SearchBar from "@/components/SearchBar.vue";

const route = useRoute();
const params = route.params;
const song = filteredSong()
const url = song[params.theme][params.instrument]
console.log("url", url)
function filteredSong() {
    let song = choroSongs.data.find((choroSong) =>
        choroSong.title.toLowerCase() === params.title.toLowerCase()
    );
    return song
}
</script>

<template>
    <SearchBar></SearchBar>
    <div>
        <h1> {{ song.title }} </h1>
    </div>
    <iframe class="musescore" :src="url" frameborder="0" allowfullscreen allow="autoplay; fullscreen">
    </iframe>

    <div v-for="video in song.youtube" :key="video">
        <iframe width="560" height="315" :src="video" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
    </div>
</template>

<style> .musescore {
     width: 80vw;
     height: 100vh;
 }
</style>