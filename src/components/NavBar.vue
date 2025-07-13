<template>
    <nav class="navbar">
        <router-link class="navbar-brand" to="/">
            CHORO
        </router-link>
        <div v-if="title">
            <h2> {{ title }} </h2>
            <h3> {{ author }} </h3>
        </div>
        <div class="nav-links">
            <router-link class="nav-link" to="/">
                <span class="material-symbols-outlined">
                    home
                </span>
            </router-link>
            <router-link class="nav-link" to="/choro">
                <span class="material-symbols-outlined">
                    format_list_bulleted
                </span>
            </router-link>
            <router-link class="nav-link" to="/info">
                <span class="material-symbols-outlined">
                    question_mark
                </span>
            </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    props: {
        showHome: {
            type: Boolean,
            default: true // Default to true if you want Home to always show
        },
        showInfo: {
            type: Boolean,
            default: true // Default to true
        },
        showSongList: {
            type: Boolean,
            default: true // Default to true
        },
        title: {
            type: String,
            default: null
        },
        author: {
            type: String,
            default: null
        },
    },
    data() {
        return {
            mobileMenuOpen: false
        }
    },
    methods: {
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        }
    }
}
</script>

<style lang="scss" scoped>
h2,
h3 {
    display: inline;
    padding-right: 1rem;
}

h2 {
    color: greenyellow;
}

h3 {
    color: rgb(212, 138, 0)
}

.navbar {
    display: flex;
    justify-content: space-between; // Distributes items with space between
    align-items: center;
    flex-wrap: nowrap; // Prevent wrapping on large screens

    width: 100vw;
    padding: 10px 25px; // More vertical padding, slightly more horizontal
    background-color: #44444400; // Solid, professional background
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); // Subtle shadow for depth
    position: sticky; // Makes navbar stick to top on scroll
    top: 0;
    z-index: 1000; // Ensures it's above other content
}

.navbar-brand {
    color: #f0f0f0;
    font-size: 2rem;
    background-color: #0000;
}

.nav-links {
    display: flex;
    align-items: center;
    justify-content: stretch;
}


.nav-link {
    color: #f0f0f0;
    background-color: #333;
    border-radius: 20px;
    margin: 0 5px;

    display: flex; // Ensures text is centered inside the link
    align-items: center;
    justify-content: center;
    height: 100%; // Optional: fill parent height
    text-align: center;
}

.nav-link.router-link-exact-active {
    background-color: #1ed760;
    color: #000;
    font-weight: 600;
}
</style>