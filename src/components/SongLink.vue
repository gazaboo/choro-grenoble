<script>
export default {
    name: 'SongLink',
    props: ['music'],
}

</script>

<template>
    <div class="songInfos">
        <h2 v-if="music.title_html" v-html="music.title_html"></h2>
        <h2 v-else> {{ music.title }}</h2>

        <h3 v-if="music.author_html" v-html="music.author_html"></h3>
        <h3 v-else> {{ music.author }}</h3>
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