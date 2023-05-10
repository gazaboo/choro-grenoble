<template>
  <SearchBar showList />
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
