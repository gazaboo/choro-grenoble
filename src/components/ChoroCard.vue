<template>
    <div class="modal-content-container">
        <div class="title-author">
            <h3>{{ music.title }}</h3>
            <h4>{{ music.author }}</h4>
        </div>

        <div class="links-wrapper">
            <template v-if="hasMuseScore">
                <router-link :to="{
                    name: 'ChoroSongMuseScoreView',
                    params: {
                        theme: 'melody',
                        instrument: 'C',
                        title: music.title,
                        author: music.author
                    }
                }" class="action-button">
                    <span>Muse Score</span>
                    <span class="info">Play sound, Loop and Slowdown</span>
                </router-link>

                <router-link :to="{
                    name: 'ChoroSongOSMDView',
                    params: {
                        theme: 'melody',
                        instrument: 'C',
                        title: music.title,
                    }
                }" class="action-button">
                    <span>Music Sheet</span>
                    <span class="info">Better for screens.</span>
                </router-link>
            </template>


            <h4>PDF Music Sheets</h4>
            <div class="pdf-links">
                <a v-for="(link, index) in pdfLinks" :key="index" :href="link.url" @click.prevent="openPdf(link.url)"
                    class="action-button pdf-link">
                    <!-- Show Instrument AND Type if it's not just 'Theme' -->
                    {{ link.instrument }} <span v-if="link.type !== 'Theme'" style="font-size: 0.8em">({{ link.type
                    }})</span>
                </a>
            </div>

            <h4 v-if="youtubeVideoIds.length || youtubeLoading"> Youtube </h4>
            <div v-if="youtubeLoading" class="youtube-container">Loading videos...</div>
            <div v-else-if="youtubeVideoIds.length" class="youtube-container">
                <iframe v-for="videoId in youtubeVideoIds" :key="videoId"
                    :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
            <div v-else class="youtube-container no-videos">No YouTube videos found.</div>
        </div>

        <!-- PDF Modal Overlay -->
        <div v-if="showPdfModal" class="pdf-modal-overlay" @click.self="closePdf">
            <div class="pdf-modal-content">
                <button class="close-pdf-btn" @click="closePdf">&times;</button>
                <iframe :src="selectedPdfUrl" type="application/pdf" width="100%" height="100%" frameborder="0">
                </iframe>
            </div>
        </div>
    </div>
</template>


<script>
import listeChoros from "@/assets/liste_totale_choros.json";

export default {
    name: 'ChoroCard',
    props: ['music', 'id'],
    data() {
        return {
            youtubeVideoIds: [],
            youtubeLoading: false,
            YOUTUBE_CACHE_EXPIRATION_MS: 24 * 60 * 60 * 1000,
            // New state for PDF Modal
            showPdfModal: false,
            selectedPdfUrl: ''
        }
    },

    created() {
        this.fetchYouTubeVideos();
    },

    // computed: {
    //     pdfLinks() {
    //         // CHANGED: Use jsDelivr to ensure correct Content-Type (application/pdf) for embedding
    //         // Original: https://raw.githubusercontent.com/gazaboo/choro-db/main/pdf/
    //         const base_url = "https://cdn.jsdelivr.net/gh/gazaboo/choro-db@main/pdf/";
    //         const instruments = ["C", "Clarinet Bb", "Saxophone Eb"];
    //         return instruments.map(inst => {
    //             const fileName = `${this.music.author} - ${this.music.title} - Theme - ${inst}.pdf`;
    //             return {
    //                 instrument: inst,
    //                 url: `${base_url}${inst}/${encodeURIComponent(fileName)}`
    //             };
    //         });
    //     },
    // },

    computed: {
        museScoreData() {
            // We match by Title AND Author to be safe
            return listeChoros.data.find(
                item => item.title === this.music.title && item.author === this.music.author
            );
        },

        hasMuseScore() {
            // Checks if we found a match AND if it actually has melody links
            // You can adjust this condition if you want strict checking for "C" key etc.
            return !!this.museScoreData;
        },

        pdfLinks() {
            // Use the actual PDFs found in the repo for this song
            if (this.music.pdfs && this.music.pdfs.length > 0) {
                return this.music.pdfs.map(pdf => ({
                    instrument: pdf.key, // "C", "Bb", "Eb"
                    type: pdf.type,      // "Theme" or "Contraponto"
                    // Use the raw URL from GitHub (or replace host with cdn.jsdelivr.net for better caching)
                    url: pdf.url.replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh').replace('/main/', '@main/')
                })).sort((a, b) => a.instrument.localeCompare(b.instrument));
            }

            // Fallback ONLY if no PDFs were found (shouldn't happen if data is clean)
            const base_url = "https://cdn.jsdelivr.net/gh/gazaboo/choro-db@main/pdf/";
            const instruments = ["C", "Clarinet Bb", "Saxophone Eb"];
            return instruments.map(inst => {
                const fileName = `${this.music.author} - ${this.music.title} - Theme - ${inst}.pdf`;
                return {
                    instrument: inst,
                    type: 'Theme',
                    url: `${base_url}${encodeURIComponent(fileName)}`
                };
            });
        },
    },

    methods: {
        openPdf(url) {
            this.selectedPdfUrl = url;
            this.showPdfModal = true;
        },
        closePdf() {
            this.showPdfModal = false;
            this.selectedPdfUrl = '';
        },
        async fetchYouTubeVideos() {
            this.youtubeLoading = true;
            const query = `${this.music.author} ${this.music.title} choro`;
            const cacheKey = `youtube_videos_${encodeURIComponent(query)}`;

            try {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const now = new Date().getTime();

                    if (now - timestamp < this.YOUTUBE_CACHE_EXPIRATION_MS) {
                        this.youtubeVideoIds = data;
                        this.youtubeLoading = false;
                        return;
                    } else {
                        localStorage.removeItem(cacheKey);
                        console.log('YouTube cache expired for:', query);
                    }
                }
            } catch (e) {
                console.error('Error reading from YouTube cache:', e);
            }

            const apiKey = process.env.VUE_APP_YOUTUBE_API_KEY;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.youtubeVideoIds = data.items.map(item => item.id.videoId);

                const cacheData = {
                    data: this.youtubeVideoIds,
                    timestamp: new Date().getTime(),
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));

            } catch (e) {
                this.youtubeVideoIds = [];
            } finally {
                this.youtubeLoading = false;
            }
        }
    }
}
</script>


<style lang="scss" scoped>
/* Main container for the modal content */
.modal-content-container {
    background-color: #2B2B2B;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    border: none;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    color: #f0f0f0;
    border-radius: 12px;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #3a3a3a;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;

        &:hover {
            background: #777;
        }
    }
}

/* Title and Author styling */
.title-author {
    text-align: left;

    h3 {
        font-size: 1.75rem;
        font-weight: 500;
        margin: 0 0 0.25rem 0;
        color: #f0f0f0;
    }

    h4 {
        font-size: 1.15rem;
        font-weight: 400;
        margin: 0;
        color: #A0A0A0;
    }
}

/* Wrapper for all action buttons */
.links-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;

    h4 {
        margin-top: 0.5rem;
        margin-bottom: 0;
        font-weight: 600;
        font-size: 1.1rem;
        color: #f0f0f0;
    }
}

/* Unified style for all action buttons */
.action-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    background-color: #44601D;
    color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    text-decoration: none;
    text-align: left;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 1.05rem;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #597d25;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    span:first-child {
        font-weight: 600;
        flex-shrink: 0;
        margin-right: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
    }

    .info {
        font-size: 0.85rem;
        font-style: italic;
        font-weight: 400;
        color: #dcdcdc;
        opacity: 0.8;
        text-align: right;
        flex-grow: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

/* Container for the horizontal PDF links */
.pdf-links {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;

    .pdf-link {
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        flex-grow: 1;
        min-width: 80px;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
}

/* YouTube video container */
.youtube-container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    iframe {
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        border-radius: 5px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
}

.youtube-container.no-videos {
    font-size: 0.9rem;
    color: #A0A0A0;
    text-align: center;
    padding: 1rem 0;
}

/* FULL SCREEN PDF MODAL STYLES */
.pdf-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 1);
    /* Solid background for immersion */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    /* High z-index to cover everything */
    padding: 0;
    /* Remove padding for full edge-to-edge */
}

.pdf-modal-content {
    position: relative;
    width: 90%;
    height: 100%;
    max-width: none;
    /* Remove width limit */
    background-color: #2B2B2B;
    border-radius: 0;
    /* Remove radius */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: solid 10px #12611a;

    iframe {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: none;
    }
}

.close-pdf-btn {
    position: fixed;
    /* Fixed to screen, stays visible */
    top: 30px;
    right: 25px;
    background: #d9534f;
    /* Red for visibility */
    border: 2px solid white;
    color: white;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2010;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    transition: transform 0.2s ease, background-color 0.2s;

    &:hover {
        background: #c9302c;
        transform: scale(1.1);
    }
}

// Media Query for Mobile Specific Styles
@media (max-width: 768px) {
    .modal-content-container {
        padding: 1.5rem 1rem;
    }

    .title-author {
        h3 {
            font-size: 1.5rem;
        }

        h4 {
            font-size: 1rem;
        }
    }

    .action-button {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0.25rem;
        padding: 0.8rem;
        flex-wrap: nowrap;
    }

    .action-button span:first-child {
        margin-right: 0;
        text-align: left;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        max-width: 100%;
    }

    .action-button .info {
        text-align: left;
        margin-left: 0;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        flex-grow: 0;
    }

    .pdf-links {
        gap: 0.5rem;
    }

    .pdf-link {
        padding: 0.6rem 0.8rem;
        font-size: 0.85rem;
    }
}
</style>
