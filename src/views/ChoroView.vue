<template>
  <NavBar />
  <div class="row">
    <div class="col-3 filters">
      <div class="filter">Top 30 Grenoble</div>
      <div class="filter">Work in progress Grenoble</div>
      <div class="filter">By Authors</div>
      <div class="filter">By Key</div>
    </div>
    <div class="col-9 search_bar">
      <SearchBar :data-to-search=data :check-partition=true />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';
import listeChoros from "@/assets/liste_totale_choros.json";

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    NavBar,
  },
  data() {
    return {
      data: listeChoros.data
    }
  }
}


</script>

<style>
.filters {
  height: 80vh;
  border: solid 1px black;
}

.search_bar {
  height: 90vh;
  overflow: scroll;
}
</style>