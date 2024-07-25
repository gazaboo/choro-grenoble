<template>
    <nav class="navbar">
        <router-link class="navbar-brand" to="/">
            <img class="logo" src="../assets/images/logo.jpg" alt="Logo">
        </router-link>
        <ul class="nav-links">
            <li v-if="showHome" class="nav-item">
                <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li v-if="showInfo" class="nav-item">
                <router-link class="nav-link" to="/info">Info</router-link>
            </li>
            <li v-if="showSongList" class="nav-item">
                <router-link class="nav-link" to="/choro">List</router-link>
            </li>
        </ul>
        <div class="title-author-container">
            <h3 v-if="title"> {{ this.title }} </h3>
            <h4 v-if="title"> {{ this.author }} </h4>
        </div>
    </nav>
</template>

<script>
export default {
    props: {
        showHome: {
            type: Boolean,
            default: false
        },
        showInfo: {
            type: Boolean,
            default: false
        },
        showSongList: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: null
        },
        author: {
            type: String,
            default: null
        },
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 20px;
    flex-wrap: nowrap;
    background-color: #fff;
    opacity: 0.9;
    /* border-radius: 15px; */
}

.navbar-brand {
    display: flex;
    align-items: center;
}

.logo {
    width: 2rem;
    height: 1.2rem;
    /* border-radius: 50%; */
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.nav-item {
    margin-left: 20px;
}

.nav-link {
    color: rgb(32, 32, 32);
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #f0f0f0;
}

h3,
h4 {
    display: inline-block;
    text-wrap: nowrap;
    margin: 0;
}

h3,
h4 {
    font-size: 1rem;
}

h4 {
    color: rgb(163, 124, 74);
}

.title-author-container {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0rem;
}
</style>
