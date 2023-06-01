<template>
    <span class="accord"> {{ accord.accord }}</span>
    <span class="qualite"> {{ accord.qualite }}</span>
    <span v-if=accord.bass class="bass"> / {{ accord.bass }}</span>
</template>

<script>
export default {
    props: ['accord']
}

</script>

<style>
.accord {
    font-family: 'Comfortaa', cursive;
    font-size: 2rem;
}


.qualite {
    font-size: 1rem;
    font-family: 'Comfortaa', cursive;
    position: relative;
    top: -1rem;
}

.bass {
    font-family: 'Comfortaa', cursive;
    font-size: 1.5rem;
}
</style>