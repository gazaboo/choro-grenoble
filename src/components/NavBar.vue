<template>
    <nav id="nav" class="navbar navbar-light bg-white">
        <router-link class="nav-link" to="/">
            <img class="navbar-brand logo img-fluid" src="../assets/logo.jpg" alt="">
        </router-link>


        <ul class="navbar-nav flex-row">
            <!-- <li class="nav-item">
                <router-link class="nav-link" to="/samba">Samba</router-link>
            </li> -->
            <li class="nav-item">
                <router-link class="nav-link" to="/choro">Choro</router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 0;
}

/* .nav-link {
    padding: 0;
    margin-left: 10px;
} */

.logo {
    width: 3rem;
}
</style>