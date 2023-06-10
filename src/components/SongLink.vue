<script>
export default {
    name: 'SongLink',
    props: ['music'],
}

</script>

<template>
    <div class="songInfos">
        <h2 v-if="music.title_clean.includes('highlight')" v-html="music.title_clean"> </h2>
        <h2 v-else v-html="music.title"> </h2>

        <h3 v-if="music.author_clean.includes('highlight')" v-html="music.author_clean"></h3>
        <h3 v-else v-html="music.author"></h3>
    </div>
</template>


<style  scoped>
/* Titre de la musique */
h2 {
    font-size: 1rem;
    font-weight: 900;
}

h3 {
    font-size: 0.75rem;
}
</style>