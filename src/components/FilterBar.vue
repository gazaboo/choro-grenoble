<template>
    <div class="filter-bar">
        <div class="filter-bar-buttons">
            <button class="custom-collapse-btn" type="button" :aria-expanded="String(showAuthors)"
                aria-controls="authors" @click="showAuthors = !showAuthors">
                Authors
            </button>
        </div>
        <div v-show="showAuthors" class="authors-container" id="authors">
            <div class="author-link" v-for="([name, count], index) of authors" :key="name">
                <input type="checkbox" class="author-checkbox" v-model="selectedAuthors"
                    :id="`author-${index}`" :value="name">
                <label :for="`author-${index}`" class="author-pill">
                    <span class="author"> {{ name }} </span>
                    <span class="author"> ({{ count }}) </span>
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
            selectedAuthors: [],
            showAuthors: false,
        }
    },

    created() {
        for (const author of new Set(this.data.map(item => item.author))) {
            const num = this.data.filter(elt => elt.author == author).length
            this.authors.set(author, num)
        }
        this.authors = new Map([...this.authors.entries()].sort());
    },

    watch: {
        selectedAuthors: {
            handler(newSelectedAuthors) {
                this.$emit('selectedAuthors', newSelectedAuthors)
            }
        }
    }
}
</script>

<style lang="scss">
.author-pill {
    background-color: $secondary-background-color;
    color: $primary-text-color;
    border-radius: 5px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0.25em 0.5em 0.25em 0.5em;

    &:hover {
        background-color: #ccf3c4;
    }
}

.author {
    padding: 0 2px;
}

/* Was Bootstrap's .btn-check: keep the checkbox operable but invisible,
   the .author-pill label is the visible control. */
.author-checkbox {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.author-checkbox:checked+label {
    background-color: #27a00ebd;
}

.author-checkbox:focus-visible+label {
    outline: 2px solid #1ed760;
    outline-offset: 2px;
}

.filter-bar-buttons {
    display: flex;
    flex-direction: row;
    padding: 0.5rem 0;
}

.custom-collapse-btn {
    display: block;
    padding: 0.5rem;
    border-radius: 5px;
    background-color: $secondary-background-color;
    text-decoration: none;
    color: black;
    border: none;
    cursor: pointer;
    font: inherit;
}

.authors-container {
    padding-bottom: 1em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 15vh;
    overflow: scroll;
}

.authors-container>div {
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0.1rem;
}

.filter-bar {
    line-height: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
    font-size: 0.75rem;
}
</style>