<template>
    <div class="home-container">
        <NavBar :showHome="true" :showSongList="true" />
        <div class="background-image"></div>
        <h1 class="title">CHORO</h1>
        <div class="button-container">
            <router-link to="/choro" class="button">Song List</router-link>
            <router-link to="/info" class="button">Info</router-link>
        </div>
        <p class="copyright">Copyrights claims: <em>florian.dadouchi@gmail.com</em></p>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'InfoView',
    components: {
        NavBar
    }
}
</script>
