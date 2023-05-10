
<script>
import listeChoros from "../assets/liste_totale_choros.json";
import listeGrenoble from "../assets/listeGrenoble.json";
import SongLink from "./SongLink.vue";

export default {

    props: {
        showList: Boolean,
    },

    components: {
        SongLink
    },

    data() {
        return {
            input: "",
            listeFilters: [],
            listeGrenoble: []
        }
    },

    methods: {
        ignore_diacritics_case(word) {
            return word.toLowerCase()
                .replaceAll(/[éêè]/g, "e")
                .replaceAll(/[áãâ]/g, "a")
                .replaceAll(/[óôõö]/g, "o")
                .replaceAll(/[ç]/g, "c")
                .replaceAll(/[íï]/g, "i")
                .replaceAll(/[ü]/g, "u")
        },

        getPodium(name) {
            let filteredList = [];
            for (let songName of listeGrenoble[name]) {
                let found = listeChoros.data.find(itemSong => itemSong.title == songName)
                if (found) {
                    filteredList.push(found);
                }
            }
            return filteredList;
        },

        has_partition(itemSong) {
            return Object.entries(itemSong.melody).map(entry => entry[1] != "").includes(true) ||
                Object.entries(itemSong.contracanto).map(entry => entry[1] != "").includes(true)
        }
    },

    computed: {
        filteredList() {

            // Get full list or podium
            let selectedList = [];
            if (this.listeFilters.length == 0) {
                selectedList = listeChoros.data;
            } else {
                for (let filter of this.listeFilters) {
                    selectedList.push(...this.getPodium(filter));
                }
            }

            // Filter by query
            selectedList = selectedList.filter(itemSong =>
                this.ignore_diacritics_case(itemSong.title).includes(this.ignore_diacritics_case(this.input))
            );

            // Return only if has partition included
            selectedList = selectedList.filter(itemSong => this.has_partition(itemSong));

            return selectedList;
        }
    }
}

</script>

<template>
    <div class="container-fluid">

        <form class="d-flex flex-fill">
            <input v-model="input" @input="e => input = e.target.value" class="form-control me-2" type="search"
                placeholder="Search" aria-label="Search">
        </form>
        <div class="filters">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="top30" value="top30" v-model="listeFilters" />
                <label class="form-check-label" for="top30">Top 30 Grenoble</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="chantiers" value="chantiers" v-model="listeFilters" />
                <label class="form-check-label" for="chantiers">Chantiers</label>
            </div>
        </div>
    </div>

    <div class="items">
        <SongLink :music="music" v-for="music in filteredList" :key="music" />
    </div>
    <div class="item error" v-if="input && !filteredList.length">
        <p>No results found!</p>
    </div>
</template>
  
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");


input {
    display: block;
    margin: 20px auto;
    padding: 10px 45px;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.items {
    display: flex;
    flex-wrap: wrap;
}

.error {
    min-width: 200px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    background-color: tomato;
}

.form-check-input {
    width: 1rem;
    height: 1rem;
    padding: 0;
}
</style>