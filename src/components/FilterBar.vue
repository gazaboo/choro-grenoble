<template>
    <div class="filter">Explore</div>

    <a class="custom-collapse-btn btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#grenoble"
        aria-expanded="false" aria-controls="grenoble">
        Grenoble
    </a>

    <div id="grenoble" class=" collapse grenobleFilters">
        <div class="form-check form-check-inline">
            <input v-model="filters.podium" id="podium" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="podium">Top 30 Grenoble</label>
        </div>
        <div class="form-check form-check-inline">
            <input v-model="filters.chantiers" id="chantiers" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="chantiers">Chantiers</label>
        </div>
    </div>

    <a class="custom-collapse-btn btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#authors"
        aria-expanded="false" aria-controls="authors">
        By Authors
    </a>
    <div class="collapse authors-container" id="authors">
        <div class="form-check form-check-inline" v-for="author of authors" :key="author">
            <input type="checkbox" class="btn-check" v-model="filters.selectedAuthors" :id="author[0]" :value="author[0]">
            <label :for="author[0]" class="custom-btn btn btn-sm btn-outline-primary">
                <span class="author"> {{ author[0] }} </span>
                <span class="author"> ({{ author[1] }}) </span>
            </label>
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

<style>
.custom-collapse-btn {
    display: block;
    margin: 1rem 0;
}

.custom-btn {
    font-size: 0.5rem;
}

.authors-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.authors-container>div {
    padding: 0;
    margin: 0.1rem;
}
</style>