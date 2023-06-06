<template>
  <NavBar />
  <SearchBar @changedInput="onInput" @changedFilters="toggleFilters" />

  <div class="items">
    <ChoroLink :music="music" v-for=" music in filteredList " :key="music" />
  </div>
  <div class="item error" v-if="input && !filteredList.length">
    <p>No results found!</p>
  </div>
</template>

<script>
// @ is an alias to /src
import listeChoros from "@/assets/liste_totale_choros.json";
import listeGrenoble from "@/assets/listeGrenoble.json";
import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';
import ChoroLink from "@/components/ChoroLink.vue";

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    NavBar,
    ChoroLink
  },

  data() {
    return {
      input: "",
      listeFilters: [],
      listeGrenoble: []
    }
  },

  methods: {
    onInput(event) {
      this.input = event
    },

    toggleFilters(event) {
      if (this.listeFilters.includes(event)) {
        this.listeFilters = this.listeFilters.filter(elt => elt != event)
      } else {
        this.listeFilters.push(event)
      }
    },

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
        || this.ignore_diacritics_case(itemSong.author).includes(this.ignore_diacritics_case(this.input))

      );

      // Return only if has partition included
      selectedList = selectedList.filter(itemSong => this.has_partition(itemSong));

      selectedList.sort((a, b) => (a.title > b.title) ? 1 : -1);
      return selectedList;
    }
  }
}


</script>

<style>
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
</style>