<template>
    <nav class="navbar navbar-expand-sm navbar-light bg-light custom-nav">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img class="logo" src="../assets/logo.jpg" alt="">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/samba">Samba</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/choro">Choro</router-link>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>

<style>
.custom-nav,
.logo {
    height: 10vh;
}
</style>