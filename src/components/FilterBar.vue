<template>
    <div class="filter-bar">

        <div class="filter-bar-buttons">
            <span class="filter-bar-title">Explore</span>
            <a class="custom-collapse-btn order-md-3" type="button" data-bs-toggle="collapse" data-bs-target="#authors"
                aria-expanded="false" aria-controls="authors">
                Authors
            </a>
            <a class="custom-collapse-btn order-md-1 disabled" type="button" data-bs-toggle="collapse"
                data-bs-target="#grenoble" aria-expanded="false" aria-controls="grenoble">
                Key
            </a>
        </div>
        <div class="authors-container collapse order-md-4" id="authors">
            <div class="form-check form-check-inline author-link" v-for="author of authors" :key="author">
                <input type="checkbox" class="btn-check" v-model="filters.selectedAuthors" :id="author[0]"
                    :value="author[0]">
                <label :for="author[0]" class="author-pill">
                    <span class="author"> {{ author[0] }} </span>
                    <span class="author"> ({{ author[1] }}) </span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],

    emits: ['changedSelection'],

    data() {
        return {
            selection: [],
            authors: new Map(),
            filters: {
                selectedAuthors: [],
                selectedKeys: [],
                podium: false,
                chantiers: false
            }
        }
    },

    created() {
        for (const author of new Set(this.data.map(item => item.author))) {
            const num = this.data.filter(elt => elt.author == author).length
            this.authors.set(author, num)
        }
    },

    watch: {
        filters: {
            handler(filters) {
                if (this.filters.selectedAuthors.length) {
                    this.selection = this.data.filter(elt => filters.selectedAuthors.includes(elt.author));
                } else {
                    this.selection = this.data;
                }
                this.$emit('changedSelection', this.selection)
            },
            deep: true
        }

    }
}
</script>

<style lang="scss">
.author-pill {
    background-color: rgb(142, 142, 255);
    color: white;
    border-radius: 10px;
    font-size: 0.75rem;
    flex-basis: auto;
    padding: 0.25em 0.5em 0.25em 0.5em;

    &:hover {
        background-color: lightblue;
    }
}

.filter-bar-buttons {
    display: flex;
    flex-direction: row;
}

.filter-bar-title {
    display: inline-flex;
    align-items: center;
    padding-right: 1rem;
    font-size: 1rem;
    margin: 0;
}

.custom-collapse-btn {
    display: block;
    padding: 0.5rem;
    margin: 1rem;
    background-color: #d7d7d7;
    text-decoration: none;
    color: black;
}

.authors-container {
    background-color: #fff;
    padding-bottom: 1em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.authors-container>div {
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0.1rem;
}

.filter-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1em;
    gap: 1em;

    @media (min-width: 768px) {
        flex-direction: column;
    }

}
</style>