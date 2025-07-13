<template>
    <NavBar />
    <div class="home-container">
        <div class="background-image"></div>
        <h1 class="title">CHORO</h1>
        <div class="button-container">
            <router-link to="/choro" class="button">Song List</router-link>
            <router-link to="/info" class="button">Info</router-link>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'HomeView',
    components: {
        NavBar
    },
}
</script>

<style scoped>
.home-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/roda_pixi_lacerda.webp');
    background-size: cover;
    background-position: center;
    z-index: -1;
    filter: blur(2px);
}


.title {
    font-size: 25vw;
    font-weight: 800;
    text-shadow:
        4px 4px 2px rgba(0, 0, 0, 0.5),
        4px -4px 2px rgba(0, 0, 0, 0.5),
        -4px 4px 2px rgba(0, 0, 0, 0.5),
        -4px -4px 2px rgba(0, 0, 0, 0.5);
    color: rgb(209, 209, 209);
    opacity: 0.7;
}

.button-container {
    display: flex;
    gap: 20px;
}

.button {
    padding: 10px 20px;
    font-size: 4vw;
    font-weight: 500;
    color: rgb(255, 255, 255);
    background-color: rgba(218, 218, 218, 0.4);
    border: 2px solid rgb(255, 255, 255);
    border-radius: 10px;
    text-decoration: none;
    text-shadow: 4px 4px 4px #000000;
    transition: background-color 0.3s, transform 0.3s;
}

.button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}


/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    .title {
        font-size: 20vw;
    }

    .button {
        font-size: 3.5vw;
    }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    .title {
        font-size: 20vw;
    }

    .button {
        font-size: 3vw;
    }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    .title {
        font-size: 11rem;
    }

    .button {
        font-size: 2.5vw;
    }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    .title {
        font-size: 14rem;
    }

    .button {
        font-size: 1.5vw;
    }
}

@media (max-width: 576px) {
    .background-image {
        background-position: 65% center;
        /* shifts image to the right */
    }
}
</style>