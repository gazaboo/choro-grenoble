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

<style  scoped></style>