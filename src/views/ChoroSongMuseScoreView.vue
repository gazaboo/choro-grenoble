<template>
    <NavBar :title="title" :author="author" />
    <p v-if="loadError" class="load-error">{{ loadError }}</p>
    <div v-else class="iframe-container">
        <iframe :key="currentUrl" ref="musescore" class="musescore" :src="currentUrl" frameborder="0" allowfullscreen
            allow="autoplay; fullscreen"></iframe>
    </div>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import { useRoute } from 'vue-router';
import { findScore } from '@/services/scoreLookup';

export default {

    name: 'ChoroSongMuseScoreView',
    components: {
        NavBar,
    },

    data() {
        return {
            song: null,
            title: "",
            author: "",
            currentKey: 'C',
            part: "melody",
            loadError: '',
        }
    },

    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;
        this.part = params.theme;
        this.currentKey = params.instrument;

        // Eight titles are shared by two composers, so matching on the title
        // alone can open somebody else's piece. The author rides along in the
        // query string, and the match ignores case and accents.
        this.song = findScore({ title: this.title, author: route.query.author });

        if (!this.song) {
            this.loadError = `No score found for "${this.title}".`;
            return;
        }
        this.author = this.song.author;
    },

    computed: {
        currentUrl() {
            if (!this.song) return '';
            return this.song[this.part][this.currentKey];
        },
    },
}
</script>



<style scoped lang="scss">
.musescore {
    width: 95vw;
    height: 85vh;
    box-shadow: 2px 5px 8px rgba(255, 255, 255, 0.215); // Subtle shadow for depth
}

.iframe-container {
    display: flex;
    justify-content: center;
}

.load-error {
    padding: 2rem 1rem;
    text-align: center;
    color: #ff8a80;
}

a,
option,
button {
    text-decoration: none;
    color: black;
    border: solid 2px $secondary-text-color;
    background-color: white;
    margin: 0.25rem;
    padding: 0.1rem 0.25rem;
    cursor: pointer;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

a:hover,
option:hover,
button:hover {
    background-color: $secondary-text-color;
}

select {
    background-color: #0094000f;
}
</style>
