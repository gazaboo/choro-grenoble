<template>
    <div class="chord">
        <span class="accord"> {{ accord.accord }}</span>
        <span class="qualite"> {{ accord.qualite }}</span>
        <span v-if=accord.bass class="bass"> /{{ accord.bass }}</span>
        &#x25B3;
    </div>
</template>

<script>
export default {
    props: ['accord']
}

</script>

<style>
.accord {
    font-family: 'Comfortaa', cursive;
    /* font-size: 2.5rem; */
}


.qualite {
    font-size: 1.5rem;
    font-family: 'Comfortaa', cursive;
    position: relative;
    top: -1rem;
}

.bass {
    font-family: 'Comfortaa', cursive;
    font-size: 2rem;
    position: relative;
    left: -0.5rem;
    top: 0.5rem;
}
</style>