<template>
  <SearchBar showList="True"></SearchBar>
</template>

<script>
// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar
  }
}
</script>
