<template>
    <NavBar />
    <GrilleSamba />
</template>

<script>
import GrilleSamba from "@/components/GrilleSamba.vue"
import NavBar from "@/components/NavBar.vue";

export default {
    name: 'SambaView',

    components: {
        NavBar,
        GrilleSamba
    }

}

</script>