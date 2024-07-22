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
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 20px;
    /* background-color: rgba(255, 255, 255, 0.2); */
    /* backdrop-filter: blur(5px); */
}

.navbar-brand {
    display: flex;
    align-items: center;
}

.logo {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
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
</style>
