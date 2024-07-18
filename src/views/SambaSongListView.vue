<template>
  <div class="main-container">
    <NavBar />
    <SearchBar @filtered-data="updatedSelection" :data-to-search=data :check-partition=true />
    <FilterBar @changed-selection="updatedSelection" :data="data"></FilterBar>
    <div class="row results">
      <div class="container-fluid">
        <SambaLink :music="music" v-for=" music in this.filteredData" :key="music" />
      </div>
    </div>
  </div>
</template>
<script>

// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';
import listeSambas from "@/assets/grillesSambas.json";
import FilterBar from '@/components/FilterBar.vue';
import SambaLink from '@/components/SambaLink.vue';

export default {
  name: 'SambaView',
  components: {
    SearchBar,
    NavBar,
    SambaLink,
    FilterBar,
  },

  data() {
    return {
      data: Object.values(listeSambas),
      filteredData: []
    }
  },

  created() {
    this.filteredData = this.data.sort((a, b) => (a > b) ? 1 : -1);
  },

  methods: {

    updatedSelection(filteredData) {
      this.filteredData = filteredData;
    },

  }
}


</script>

<style>
.filters,
.results {
  height: 80vh;
  overflow: scroll;
}

.itemSong {
  border-bottom: solid green 1px;
  margin-bottom: 1rem;
  padding-bottom: 1rem;

}
</style>