<template>
  <NavBar />
  <SearchBar />
</template>

<script>
// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    NavBar
  }
}
</script>
