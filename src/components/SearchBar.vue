
<script setup>

import { defineProps, ref } from "vue";
import listeChoros from "../assets/liste_totale_choros.json";
import SongLink from "./SongLink.vue";

const props = defineProps({
    showList: Boolean,
});

function ignore_diacritics_case(word) {
    return word.toLowerCase()
        .replaceAll(/[éêè]/g, "e")
        .replaceAll(/[áãâ]/g, "a")
        .replaceAll(/[óôõö]/g, "o")
        .replaceAll(/[ç]/g, "c")
        .replaceAll(/[íï]/g, "i")
        .replaceAll(/[ü]/g, "u")
}

let input = ref("");
function filteredList() {
    let selectedList = listeChoros.data.filter((itemSong) =>
        ignore_diacritics_case(itemSong.title).includes(ignore_diacritics_case(input.value))
    );
    selectedList = selectedList.filter(itemSong =>
        Object.entries(itemSong.melody).map(entry => entry[1] != "").includes(true) ||
        Object.entries(itemSong.contracanto).map(entry => entry[1] != "").includes(true)
    );
    return selectedList
}
</script>

<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="../assets/logo.jpg" alt="" width="100">
            </a>
            <a class="navbar-brand">Choro do Beco <br> Grenoble</a>
            <form v-if="props.showList" class="d-flex flex-fill">
                <input v-model="input" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            </form>
            <router-link v-else to="/">
                <a> Home </a>
            </router-link>


        </div>
    </nav>
    <div class="items" v-if="props.showList">
        <SongLink :music="music" v-for="music in filteredList()" :key="music" />
    </div>
    <div class="item error" v-if="input && !filteredList().length">
        <p>No results found!</p>
    </div>
</template>
  
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");


input {
    display: block;
    width: 350px;
    margin: 20px auto;
    padding: 10px 45px;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
    width: 350px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.error {
    background-color: tomato;
}
</style>