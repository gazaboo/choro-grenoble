<template>
    <div class="modal-content-container">
        <div class="title-author">
            <h3>{{ music.title }}</h3>
            <h4>{{ music.author }}</h4>
        </div>

        <div class="links-wrapper">
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

            <h4>Download PDF</h4>
            <div class="pdf-links">
                <a v-for="link in pdfLinks" :key="link.instrument" :href="link.url" target="_blank" rel="noopener"
                    class="action-button pdf-link">
                    {{ link.instrument }}
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
    </div>
</template>

<script>
export default {
    name: 'ChoroCard',
    props: ['music', 'id'],
    data() {
        return {
            youtubeVideoIds: [],
            youtubeLoading: false,
            YOUTUBE_CACHE_EXPIRATION_MS: 24 * 60 * 60 * 1000,
        }
    },

    created() {
        this.fetchYouTubeVideos();
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
        },
    },

    methods: {
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

            // 2. Fetch from YouTube API if not in cache or expired
            const apiKey = process.env.VUE_APP_YOUTUBE_API_KEY;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.youtubeVideoIds = data.items.map(item => item.id.videoId);

                // 3. Store new data in cache
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
    background-color: #2B2B2B; // Your $secondary-dark-bg
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    border: none;
    width: 100%;
    max-height: 80vh; // Ensure it doesn't overflow viewport
    overflow-y: auto; // Use 'auto' to show scrollbar only when needed
    color: #f0f0f0; // Your $text-light
    border-radius: 12px; // Match modal border-radius

    // Custom scrollbar for dark mode (optional, but good for polish)
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #3a3a3a; // Darker track
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #555; // Darker thumb
        border-radius: 4px;

        &:hover {
            background: #777; // Lighter on hover
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
        color: #A0A0A0; // Your $text-muted
    }
}

/* Wrapper for all action buttons */
.links-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;

    /* Section title for PDF downloads / Youtube */
    h4 {
        margin-top: 0.5rem;
        margin-bottom: 0;
        font-weight: 600; // Slightly bolder for section titles
        font-size: 1.1rem; // Slightly larger
        color: #f0f0f0; // Ensure these stand out
    }
}

/* Unified style for all action buttons */
.action-button {
    display: flex;
    justify-content: space-between; // Space between main text and info text on desktop
    align-items: center;
    flex-wrap: wrap; // Allow wrapping on larger screens by default
    gap: 10px;
    background-color: #44601D; // This is your current green accent. Consider replacing with $accent-color.
    color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px; // Slightly more rounded
    text-decoration: none;
    text-align: left;
    transition: background-color 0.2s ease, box-shadow 0.2s ease; // Add box-shadow transition
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 1.05rem; // Slightly larger for better readability
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #597d25; // Darken/lighten your accent color on hover.
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); // Subtle shadow on hover
    }

    span:first-child {
        // Main button text (e.g., "Muse Score", "Music Sheet")
        font-weight: 600; // Make main text bolder
        flex-shrink: 0; // Prevent main text from shrinking too much
        margin-right: auto; // Pushes the .info span to the right on larger screens
        // Desktop-specific text overflow (will be overridden on mobile)
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%; // Prevent it from pushing info text too much
    }

    .info {
        font-size: 0.85rem; // Slightly larger info text
        font-style: italic;
        font-weight: 400;
        color: #dcdcdc;
        opacity: 0.8; // Slightly less opaque to differentiate
        text-align: right; // Right-align on desktop
        flex-grow: 1; // Allows info to take remaining space on desktop
        min-width: 0; // Allows text-overflow to work correctly in flex items on desktop
        // Desktop-specific text overflow (will be overridden on mobile)
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

    /* Styling for the individual PDF links */
    .pdf-link {
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        flex-grow: 1;
        min-width: 80px; // Ensure minimum width for buttons
        padding: 0.75rem 1rem; // Adjust padding for smaller buttons
        font-size: 0.9rem; // Smaller font for instrument names
        // Inherits action-button styles for background/hover
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); // Subtle shadow for videos
    }
}

.youtube-container.no-videos {
    font-size: 0.9rem;
    color: #A0A0A0;
    text-align: center;
    padding: 1rem 0;
}

// Media Query for Mobile Specific Styles
@media (max-width: 768px) {
    .modal-content-container {
        padding: 1.5rem 1rem; // Slightly less padding on mobile
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
        flex-direction: column; // Stack items vertically on mobile
        align-items: flex-start; // Align content to the left
        justify-content: flex-start; // Align content to the top
        gap: 0.25rem; // Smaller gap for vertical stacking
        padding: 0.8rem; // Slightly less padding for smaller buttons
        flex-wrap: nowrap; // No need for wrapping if it's a column, but good to ensure
    }

    .action-button span:first-child {
        // Main button text
        margin-right: 0; // Remove auto margin from desktop
        text-align: left; // Ensure main text is left-aligned
        white-space: normal; // Allow text to wrap naturally within its width
        overflow: visible; // Allow overflow to be visible
        text-overflow: clip; // No ellipsis needed when wrapping naturally
        max-width: 100%; // Allow to take full width of button
    }

    .action-button .info {
        text-align: left; // Align info text to the left below main text
        margin-left: 0; // Remove auto margin from desktop
        white-space: normal; // Allow text to wrap naturally
        overflow: visible; // Allow overflow to be visible
        text-overflow: clip; // No ellipsis needed when wrapping naturally
        flex-grow: 0; // No need to grow when stacking
    }

    .pdf-links {
        gap: 0.5rem; // Reduce gap for PDF buttons
    }

    .pdf-link {
        padding: 0.6rem 0.8rem; // Adjust padding for smaller PDF buttons
        font-size: 0.85rem; // Slightly smaller font
    }
}
</style>