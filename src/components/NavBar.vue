<template>
    <nav class="navbar">
        <router-link class="navbar-brand" to="/">
            CHORO
        </router-link>

        <ul class="nav-links" :class="{ 'nav-links-mobile': mobileMenuOpen }">
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
            <h3 v-if="title" class="current-title">{{ title }}</h3>
            <h4 v-if="author" class="current-author">{{ author }}</h4>
        </div>

        <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            &#9776;
        </button>
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
    align-items: center;
    padding: 10px 25px; // More vertical padding, slightly more horizontal
    background-color: $primary-bg-color; // Solid, professional background
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); // Subtle shadow for depth
    position: sticky; // Makes navbar stick to top on scroll
    top: 0;
    z-index: 1000; // Ensures it's above other content
    flex-wrap: nowrap; // Prevent wrapping on large screens
}

.navbar-brand {
    color: $text-light;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-right: 30
}

.logo {
    height: 35px; // Slightly larger for better visibility
    width: auto; // Maintain aspect ratio
    border-radius: 0; // No border-radius unless part of your brand
    object-fit: contain; // Ensures entire logo is visible
    // No box-shadow unless part of your brand style
}

.nav-links {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
    flex-grow: 1; // Allows nav-links to take up available space
    justify-content: center; // Center the links within their flexible space

    @media (max-width: 768px) {
        display: none; // Hide on mobile, will be toggled by JS
        // When visible:
        // position: absolute;
        // top: 100%;
        // left: 0;
        // width: 100%;
        // background-color: $primary-bg-color;
        // flex-direction: column;
        // align-items: center;
        // padding: 20px 0;
    }

    &.is-active {
        display: flex !important; // Override display none when active
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: $primary-bg-color;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        z-index: 999; // Ensure it appears above other content
    }

    &.nav-links-mobile {
        display: flex !important; // Ensure flex display for mobile menu
        position: absolute;
        top: 60px; // adjust as needed
        left: 0;
        width: 100%;
        background-color: $primary-bg-color;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        z-index: 999; // Ensure it appears above other content
    }
}

.nav-item {
    margin: 0 15px; // Consistent spacing between items
}

.nav-link {
    color: $text-light; // Light text on dark background
    text-decoration: none;
    font-size: 1.05rem; // Slightly larger for readability
    font-weight: 500; // Medium weight, less bold for modern look
    padding: 8px 12px; // Add padding for click area
    border-radius: 4px; // Subtle border-radius
    transition: background-color 0.3s ease, color 0.3s ease; // Smooth transitions

    &:hover {
        background-color: rgba($accent-color, 0.2); // Subtle background highlight on hover
        color: $accent-color; // Accent color on hover
    }

    // Styles for active route link
    &.router-link-exact-active {
        background-color: $accent-color; // Solid accent background for active link
        color: $primary-bg-color; // Dark text on accent background for active link
        font-weight: 600; // Slightly bolder for active
    }
}

.title-author-container {
    display: flex;
    flex-direction: column; // Stack title and author vertically
    align-items: flex-end; // Align text to the right within the container
    margin-left: 30px; // Space between nav links and title/author
    flex-shrink: 0; // Prevent shrinking too much

    @media (max-width: 992px) {
        margin-left: 15px; // Reduce margin on smaller screens

        .current-author {
            display: none; // Hide author on smaller screens if space is tight
        }
    }

    @media (max-width: 768px) {
        display: none; // Hide completely on mobile to prioritize main nav
    }
}

.current-title {
    font-size: 1.1rem; // More prominent size
    font-weight: 600;
    color: $text-light;
    margin: 0; // Reset default margins
    text-align: right;
    white-space: nowrap; // Keep title on one line
    overflow: hidden; // Hide overflow
    text-overflow: ellipsis; // Add ellipsis for long titles
}

.current-author {
    font-size: 0.9rem; // Slightly smaller than title
    color: $secondary-text-color; // Muted color
    margin: 0; // Reset default margins
    text-align: right;
    white-space: nowrap; // Keep author on one line
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-menu-toggle {
    display: none; // Hidden by default on desktop

    @media (max-width: 768px) {
        display: block; // Show hamburger icon on mobile
        background: none;
        border: none;
        color: $text-light;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;

        &:focus {
            outline: none; // Remove outline on focus for a cleaner look
        }
    }
}
</style>