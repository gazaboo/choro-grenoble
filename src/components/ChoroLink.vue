<template>
    <button @click="toggleMuseScores" class="main-container">
        <span class="song-number"> {{ this.id + 1 }} </span>
        <div class="song-infos">
            <div class="title-author">
                <h3> {{ music.title }}</h3>
                <h4> {{ music.author }}</h4>
            </div>

            <transition name="fade">
                <div v-if="showLinks" class="container-osmd-mscore">
                    <div class="container-links">
                        <div class="link">
                            <router-link :to="{
                                name: 'ChoroSongMuseScoreView',
                                params: {
                                    theme: 'melody',
                                    instrument: 'C',
                                    title: music.title,
                                    author: music.author
                                }
                            }">
                                Muse Score
                            </router-link>
                            <span class="info"> Play sound, Loop and Slowdown</span>
                        </div>

                    </div>
                    <div class="container-links">
                        <div class="link">
                            <router-link :to="{
                                name: 'ChoroSongOSMDView',
                                params: {
                                    theme: 'melody',
                                    instrument: 'C',
                                    title: music.title,
                                }
                            }">
                                Music Sheet
                            </router-link>
                            <span class="info">Better for screens. </span>
                        </div>

                    </div>

                    <div v-for="link in pdfLinks" :key="link.instrument" class="container-links">
                        <a :href="link.url" target="_blank" rel="noopener">
                            Download PDF ({{ link.instrument }})
                        </a>
                    </div>
                </div>
            </transition>
        </div>
    </button>
</template>

<script>

export default {
    name: 'ChoroLink',
    props: ['music', 'id'],

    data() {
        return {
            showLinks: false,
        }
    },

    computed: {
        pdfLinks() {
            const base_url = "https://raw.githubusercontent.com/gazaboo/choro-db/main/pdf/";
            const instruments = ["C", "Clarinet Bb", "Saxophone Eb"];
            return instruments.map(inst => {
                const fileName = `${this.music.author} - ${this.music.title} - Theme - ${inst}.pdf`;
                return {
                    instrument: inst,
                    url: `${base_url}${inst}/${encodeURIComponent(fileName)}`
                };
            });
        }
    },

    methods: {
        toggleMuseScores() {
            this.showLinks = !this.showLinks;
        }
    }
}
</script>



<style scoped lang="scss">
/* Card */
.main-container {
    width: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0.4) 50%);
    border: none;
    border-bottom: solid 1px;
    border-image: linear-gradient(to right, $secondary-background-color 0%, $secondary-background-color 50%, transparent 75%) 1;
    padding-bottom: 1rem;
    padding-top: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    gap: 1rem;

    @media (min-width: 576px) {
        gap: 2rem;
    }
}

.container-osmd-mscore {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    gap: 0.5rem;
}


// Media query to detect laptops and make hover effect
@media (pointer:fine) {
    .main-container:hover {
        // background-color: rgba(255, 255, 255, 0.7);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transform: scale(1.02);
    }

    .main-container:hover .song-infos h3 {
        font-size: 1.6rem;
    }

    .main-container:hover .song-infos h4 {
        font-size: 1.3rem;
    }
}

.title-author {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    column-gap: 1rem;
    flex-wrap: wrap;
}


.container-links {
    display: flex;
    flex-direction: row;
}

.song-number {
    color: grey;
    font-size: 1.2rem;
}

/* Liens vers la partition */
a {
    font-size: 0.9rem;
    padding: 0.3rem;
    background-color: rgb(70, 104, 19);
    border-radius: 3px;
    margin-right: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    color: white;
    transition: background-color 0.1s;
    text-align: center;
}

a:hover {
    background-color: rgb(56, 175, 58);
}

.role {
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
}

.fade-enter-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-active {
    transition: opacity 0s ease, transform 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.info {
    font-size: small;
    font-style: italic;
    color: $primary-text-color;

}

h3 {
    font-size: 1.2rem;
    font-weight: 900;
    margin: 0.25rem 0;
    white-space: nowrap;
}

h4 {
    font-size: 1rem;
    margin: 0.25rem 0;
    color: $primary-text-color;
    font-weight: 700;
    background: linear-gradient(to top, $secondary-background-color 20%, transparent 90%); // white-space: nowrap;
    border-radius: 5px;
    padding: 0 5px;
}

h3,
h4 {
    text-shadow:
        1px 1px 2px rgba(255, 225, 0, 0.126),
        // 1px -1px 2px rgba(255, 255, 255, 0.9),
        // -1px 1px 2px rgba(255, 255, 255, 0.9),
        // -1px -1px 2px rgba(255, 255, 255, 0.9);
}

.song-infos {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
</style>