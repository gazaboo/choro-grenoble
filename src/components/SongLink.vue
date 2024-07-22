<script>
export default {
    name: 'SongLink',
    props: ['music'],
}

</script>

<template>
    <div class="song-infos">
        <h3 v-if="music.title_html" v-html="music.title_html"></h3>
        <h3 v-else> {{ music.title }}</h3>
        <h4 v-if="music.author_html" v-html="music.author_html"></h4>
        <h4 v-else> {{ music.author }}</h4>
    </div>
</template>

<style scoped lang="scss">
h3 {
    font-size: 1.2rem;
    margin: 0.25rem 0;
}

h4 {
    font-size: 1rem;
    margin: 0.25rem 0;
    color: rgb(75, 75, 75);
}

h3,
h4 {
    text-shadow:
        1px 1px 2px rgba(255, 225, 0, 0.126),
        // 1px -1px 2px rgba(255, 255, 255, 0.9),
        // -1px 1px 2px rgba(255, 255, 255, 0.9),
        // -1px -1px 2px rgba(255, 255, 255, 0.9);
}
</style>