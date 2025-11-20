<template>
    <div class="pdf-view-container">
        <div class="pdf-header">
            <h1>{{ title }}</h1>
            <h2>{{ author }}</h2>
            <p>Instrument: {{ instrument }}</p>
        </div>
        <div class="pdf-embed">
            <iframe :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PdfView',
    props: ['title', 'author', 'instrument'],
    computed: {
        pdfUrl() {
            const base_url = "https://raw.githubusercontent.com/gazaboo/choro-db/main/pdf/";
            const fileName = `${this.author} - ${this.title} - Theme - ${this.instrument}.pdf`;
            // Use query parameter to avoid issues with special characters in path
            return `${base_url}${this.instrument}/${encodeURIComponent(fileName)}`;
        }
    }
}
</script>

<style lang="scss" scoped>
.pdf-view-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px); // Assuming NavBar height is 60px
    background-color: #2c2c2c;
    color: #f0f0f0;
}

.pdf-header {
    padding: 1rem;
    background-color: #1e1e1e;
    border-bottom: 1px solid #444;
    text-align: center;

    h1 {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
    }

    h2 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        color: #a0a0a0;
    }

    p {
        margin: 0;
        font-size: 1rem;
    }
}

.pdf-embed {
    flex-grow: 1;
    overflow: hidden;
}

iframe {
    border: none;
}
</style>
