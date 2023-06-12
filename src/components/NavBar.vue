<template>
    <nav class="navbar navbar-light bg-light justify-content-start">
        <a class="navbar-brand" href="#">
            <img class="logo img-fluid" src="../assets/logo.jpg" alt="">
        </a>

        <ul class="navbar-nav flex-row">
            <li class="nav-item">
                <router-link class="nav-link" to="/samba">Samba</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/choro">Choro</router-link>
            </li>
        </ul>
    </nav>
</template>

<style>
.logo {
    width: 5rem;
}

li {
    padding-left: 2rem;
}
</style>