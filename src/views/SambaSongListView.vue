<template>
  <div class="main-container">
    <NavBar />
    <SearchBar @filtered-data="updatedSelection" :data-to-search=data :check-partition=true />
    <FilterBar @changed-selection="updatedSelection" :data="data"></FilterBar>
    <div class="results">
      <SambaLink :music="music" v-for="music in filteredData" :key="`${music.author}||${music.title}`" />
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

  methods: {

    updatedSelection(filteredData) {
      this.filteredData = filteredData;
    },

  }
}


</script>

<style lang="scss">
/* Replaces Bootstrap's .row/.container-fluid, which is no longer loaded. */
.results {
  width: 100%;
  height: 80vh;
  overflow-y: auto;
  padding: 0 0.75rem;
}
</style>