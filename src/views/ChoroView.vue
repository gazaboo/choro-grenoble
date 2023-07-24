<template>
  <div class="main-container">
    <NavBar class="row nav_bar" />
    <div class="row">
      <FilterBar class="col-md-4 filters" @changed-selection="updatedSelection" :data="data"></FilterBar>
      <div class="col-md-8 results">
        <SearchBar class="search_bar " @filtered-data="updatedSelection" :data-to-search=data :check-partition=true />
        <div class="container-fluid">
          <ChoroLink :music="music" v-for=" music in this.filteredData" :key="music" />
        </div>
      </div>
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
      filteredData: [],
    }
  },

  created() {
    this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
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

<style lang="scss">
.results {
  height: 80vh;
  overflow: scroll;
}
</style>