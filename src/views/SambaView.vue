<template>
    <NavBar />
    <SearchBar :data-to-search=data />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import SearchBar from '@/components/SearchBar.vue';
import grillesSambas from "@/assets/grillesSambas.json";

export default {
    name: 'SambaView',

    components: {
        NavBar,
        SearchBar
    },

    data() {
        return {
            data: grillesSambas.data
        }
    }
}

</script>