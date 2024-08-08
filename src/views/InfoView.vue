<template>
    <div class="info-container">
        <NavBar :showHome="true" :showSongList="true" />
        <h1 class="title">Information</h1>

        <section class="info-section" v-scroll-reveal="{ origin: 'bottom', distance: '600px' }">
            <h2>Copyright Claims</h2>
            <p>If you have any copyright concerns or claims regarding the content on this site, please contact us
                immediately at <em>florian.dadouchi@gmail.com</em>. We respect intellectual property rights and will
                address any issues promptly.</p>
        </section>

        <section class="info-section" v-scroll-reveal="{ origin: 'bottom', distance: '600px' }">
            <h2>Using the MuseScore Page</h2>
            <p>Our MuseScore page allows you to view and interact with sheet music. Here's how to use it:</p>
            <ul>
                <li>Navigate through the score using the arrow keys or scroll wheel</li>
                <li>Adjust playback speed using the tempo control</li>
                <li>Loop sections by selecting measures and clicking the loop button</li>
                <li>Toggle between different instrument parts if available</li>
            </ul>
        </section>

        <section class="info-section" v-scroll-reveal="{ origin: 'bottom', distance: '600px' }">
            <h2>Using the OSMD Page</h2>
            <p>The OSMD (OpenSheetMusicDisplay) page offers an alternative way to view sheet music. Here's what you need
                to know:</p>
            <ul>
                <li>Zoom in or out using the controls at the top of the page</li>
                <li>Click on measures to hear them played back</li>
                <li>Use the transport controls to start, stop, or pause playback</li>
                <li>Adjust settings like note spacing and layout in the options menu</li>
            </ul>
        </section>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import ScrollReveal from 'scrollreveal';

export default {
    name: 'InfoView',
    components: {
        NavBar
    },
    mounted() {
        ScrollReveal().reveal('.info-section');
    },
    directives: {
        'scroll-reveal': {
            inserted: function (el, binding) {
                ScrollReveal().reveal(el, binding.value);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.info-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
}

.title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.info-section {
    margin-bottom: 20vh;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    h2 {
        color: #3498db;
        margin-bottom: 1rem;
    }

    p,
    ul {
        color: #34495e;
        line-height: 1.6;
    }

    ul {
        padding-left: 1.5rem;
    }
}
</style>
