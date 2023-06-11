<template>
  <NavBar />
  <div class="row">
    <div class="col-4 filters">
      <FilterBar @changed-selection="updatedSelection" :data="data"></FilterBar>
    </div>
    <div class="col-8 search_bar">
      <SearchBar @filtered-data="updatedSelection" :data-to-search=data :check-partition=true />
      <ChoroLink :music="music" v-for=" music in this.filteredData" :key="music" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';
import listeChoros from "@/assets/liste_totale_choros.json";
import ChoroLink from '@/components/ChoroLink.vue';
import FilterBar from '@/components/FilterBar.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    NavBar,
    ChoroLink,
    FilterBar
  },

  data() {
    return {
      data: listeChoros.data.filter(itemSong => this.has_partition(itemSong)),
      filteredData: listeChoros.data,
    }
  },

  methods: {

    updatedSelection(filteredData) {
      this.filteredData = filteredData;
    },

    has_partition(itemSong) {
      return Object.entries(itemSong.melody).map(entry => entry[1] != "").includes(true) ||
        Object.entries(itemSong.contracanto).map(entry => entry[1] != "").includes(true)
    },
  }
}


</script>

<style>
.filters {
  height: 80vh;
  border: solid 1px black;
}
</style>