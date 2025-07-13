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
                    <div v-if="youtubeLoading">Loading videos...</div>
                    <div v-else>
                        <iframe v-for="videoId in youtubeVideoIds" :key="videoId" width="320" height="180"
                            :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0" allowfullscreen></iframe>
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
            youtubeVideoIds: [],
            youtubeLoading: false,
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

    watch: {
        showLinks(newVal) {
            if (newVal && this.youtubeVideoIds.length === 0) {
                this.fetchYouTubeVideos();
            }
        }
    },

    methods: {
        toggleMuseScores() {
            this.showLinks = !this.showLinks;
        },

        async fetchYouTubeVideos() {
            this.youtubeLoading = true;
            const query = `${this.music.author} ${this.music.title} choro`;
            const apiKey = process.env.VUE_APP_YOUTUBE_API_KEY;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                this.youtubeVideoIds = data.items.map(item => item.id.videoId);
                console.log('Fetching YouTube videos for:', this.youtubeVideoIds);
            } catch (e) {
                console.error('Failed to fetch YouTube videos', e);
            } finally {
                this.youtubeLoading = false;
            }
        }
    }
}
</script>



<style lang="scss">
$secondary-dark-bg: #2B2B2B;

/* Card */
.main-container {
    width: 100%;
    background-color: $secondary-dark-bg;
    border: none;
    border-bottom: solid 1px;
    // border-color: #7cb82756;
    // border-image: linear-gradient(to right, $secondary-background-color 0%, $secondary-background-color 50%, transparent 75%) 1;
    padding-bottom: 1rem;
    padding-top: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;

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

.title-author {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    column-gap: 1rem;
    flex-wrap: wrap;
    color: #9f9f9f;
}

h3 {
    color: #f0f0f0;
}

// Media query to detect laptops and make hover effect
@media (pointer:fine) {
    .main-container:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        background-color: #444444d3;
    }

    .main-container:hover h4 {
        color: #f0f0f0; // or any color you want
    }
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
    background-color: rgba(56, 175, 58, 0.933);
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
    color: #f0f0f0 !important;
    // color: $primary-text-color;

}

h3 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0.25rem 0;
    white-space: nowrap;
}

h4 {
    font-size: 1rem;
    margin: 0.25rem 0;
    // color: $primary-text-color;
    font-weight: 400;
    // background: linear-gradient(to top, $secondary-background-color 20%, transparent 90%); // white-space: nowrap;
    border-radius: 5px;
    padding: 0 5px;
    color: #A0A0A0;
}

.song-infos {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
</style>