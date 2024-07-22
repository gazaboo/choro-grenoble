<template>
    <div class="main-container">
        <SongLink :music="music"></SongLink>
        <router-link :to="{
            name: 'GrilleSambaView',
            params: {
                title: music.title
            }
        }">
            <span class="material-symbols-rounded">
                play_circle
            </span>
        </router-link>
    </div>
</template>

<script>
import SongLink from './SongLink.vue'

export default {
    name: 'SambaLink',
    props: ['music'],
    components: {
        SongLink
    },
}
</script>

<style scoped>
.main-container {
    display: flex;
    align-items: center;
}

.material-symbols-rounded {
    color: green;
    margin-left: 1rem;
}
</style>
