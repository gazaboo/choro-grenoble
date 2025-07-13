<template>
    <nav class="navbar">
        <router-link class="navbar-brand" to="/">
            CHORO
        </router-link>
        <div class="nav-links">
            <router-link class="nav-link" to="/">Home</router-link>
            <router-link class="nav-link" to="/info">Info</router-link>
            <router-link class="nav-link" to="/choro">List</router-link>
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
// Define your SCSS variables here or import them from a global file
$primary-bg-color: #7d7e7e; // Deep Charcoal/Navy
$accent-color: #e6b800; // Rich Gold
$text-light: #f0f0f0; // Off-white for text on dark bg
$secondary-text-color: #b0c4de; // Light steel blue for secondary text

.navbar {
    display: flex;
    justify-content: space-between; // Distributes items with space between
    align-items: flex-start;
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
</style>