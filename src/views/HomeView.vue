<template>
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
export default {
    name: 'HomeView',
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
    background-image: url('@/assets/main_page.jpeg');
    background-size: cover;
    background-position: center;
    filter: blur(3px);
    transform: scale(1.1);
    z-index: -1;
}

.title {
    font-size: 20vw;
    font-weight: 800;
    text-shadow: 4px 4px 4px #000000;
    color: white;
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
</style>