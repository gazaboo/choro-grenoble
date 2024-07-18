<script>
export default {
    name: 'SongLink',
    props: ['music'],
}

</script>

<template>
    <div class="songInfos">
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

.songInfos {
    display: flex;
    flex-direction: column;
    align-items: baseline;

    @media (min-width: 500px) {
        flex-direction: row;
        column-gap: 10px;
    }
}
</style>