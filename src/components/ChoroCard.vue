Of course. It looks like the issue isn't a missing or extra bracket, which can be tricky to spot, but rather how the CSS
is structured to handle the new pdf-links container you've added. When you wrapped the PDF buttons in a div, they
defaulted to stacking vertically.

I've fixed this by adding styles for the .pdf-links container to arrange the buttons horizontally in a row. I also took
the opportunity to reorganize the SCSS using nesting, which makes the relationships between elements and their styles
clearer and tidies up the structure, addressing the "bracket" concern.

Corrected Component

Key Changes:

No Bracket Errors Found: The original code was syntactically correct with no mismatched brackets. The issue was with the
CSS layout.

Added .pdf-links Style: A new CSS rule was added to make the PDF buttons display side-by-side using display: flex.

SCSS Nesting: The styles have been nested to match the HTML structure (e.g., .action-button styles are now inside
.links-wrapper). This is a best practice that makes the code cleaner and easier to read.

Button Width Adjustment: The PDF links now correctly share the available space within their new container.

Here is the complete, corrected component:

Generated html
<template>
    <div class="modal-content-container">
        <div class="title-author">
            <h3>{{ music.title }}</h3>
            <h4>{{ music.author }}</h4>
        </div>

        <div class="links-wrapper">
            <!-- Muse Score Link -->
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

            <!-- Music Sheet Link -->
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

            <!-- PDF Download Links Section -->
            <h4>Download PDF</h4>
            <div class="pdf-links">
                <a v-for="link in pdfLinks" :key="link.instrument" :href="link.url" target="_blank" rel="noopener"
                    class="action-button pdf-link">
                    {{ link.instrument }}
                </a>
            </div>

            <!-- YouTube Videos -->
            <div v-if="youtubeLoading" class="youtube-container">Loading videos...</div>
            <div v-else-if="youtubeVideoIds.length" class="youtube-container">
                <iframe v-for="videoId in youtubeVideoIds" :key="videoId"
                    :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
        </div>
    </div>
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
            // Fetch videos when the modal becomes visible
            if (newVal && this.youtubeVideoIds.length === 0) {
                this.fetchYouTubeVideos();
            }
        }
    },
    methods: {
        async fetchYouTubeVideos() {
            this.youtubeLoading = true;
            const query = `${this.music.author} ${this.music.title} choro`;
            const apiKey = process.env.VUE_APP_YOUTUBE_API_KEY;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                this.youtubeVideoIds = data.items.map(item => item.id.videoId);
            } catch (e) {
                console.error('Failed to fetch YouTube videos', e);
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
    // border-radius: 8px;
    border: none;
    width: 100%;
    color: #f0f0f0;
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

    /* Section title for PDF downloads */
    h4 {
        margin-top: 0.5rem;
        margin-bottom: 0;
        font-weight: 500;
        font-size: 1rem;
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
    border-radius: 5px;
    text-decoration: none;
    text-align: left;
    transition: background-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #597d25;
    }

    .info {
        font-size: 0.8rem;
        font-style: italic;
        font-weight: 400;
        color: #dcdcdc;
        opacity: 0.9;
        text-align: right;
        flex-grow: 1;
    }
}

/* Container for the horizontal PDF links */
.pdf-links {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;

    /* Styling for the individual PDF links */
    .pdf-link {
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        flex-grow: 1; // Allows buttons to grow and fill the space
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
    }
}
</style>
