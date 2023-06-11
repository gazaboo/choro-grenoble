<template>
    <div class="filter">By Authors</div>
    <div class="filter">By Key</div>
    <div class="otherfilters">
        <div class="form-check form-check-inline">
            <input v-model="filters.podium" id="podium" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="podium">Top 30 Grenoble</label>
        </div>
        <div class="form-check form-check-inline">
            <input v-model="filters.chantiers" id="chantiers" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="chantiers">Chantiers</label>
        </div>
    </div>

    <div class="form-check form-check-inline" v-for="author of authors" :key="author">
        <input type="checkbox" class="btn-check" v-model="filters.selectedAuthors" :id="author[0]" :value="author[0]">
        <label :for="author[0]" class="btn btn-sm btn-outline-primary"> {{ author }} </label>
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
label {
    font-size: 0.5rem;
}
</style>