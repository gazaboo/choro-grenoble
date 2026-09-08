<template>
    <div class="wrapper">
        <div class="button-and-seachbar-wrapper">
            <input @focus="handleFocus" @input="onChangedInput" type="search" placeholder="Search..."
                aria-label="Search">
        </div>
    </div>
</template>


<script>
import { markRaw } from 'vue'
import Fuse from 'fuse.js'

const SEARCH_DEBOUNCE_MS = 180

const FUSE_OPTIONS = {
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    keys: ['title_html', 'author_html']
}

export default {

    props: {
        dataToSearch: {
            type: Array,
            default: () => []
        },
        checkPartition: {
            type: Boolean,
            default: false
        }
    },

    emits: ['filteredData', 'search-activated'],

    data() {
        return {
            input: "",
            // Search corpus: title_html/author_html hold accent-folded text so
            // Fuse matches "acucar" against "açúcar".
            data: [],
            // What we emit for an empty query: same objects every time, so the
            // consumer's :key stays stable and Vue patches instead of remounting.
            plainList: [],
            fuse: null,
            debounceTimer: null
        }
    },

    watch: {
        dataToSearch: {
            immediate: true, // Run immediately on mount if data exists
            handler(newData) {
                if (!newData || newData.length === 0) {
                    this.data = [];
                    this.plainList = [];
                    this.fuse = null;
                } else {
                    const sorted = newData.slice().sort((a, b) => (a.title > b.title) ? 1 : -1);

                    this.data = sorted.map((item, index) => ({
                        ...item,
                        id: index + 1,
                        title_html: this.clean_string(item.title),
                        author_html: this.clean_string(item.author)
                    }));

                    this.plainList = sorted.map((item, index) => ({
                        ...item,
                        id: index + 1,
                        title_html: item.title,
                        author_html: item.author
                    }));

                    // Built once per dataset instead of once per keystroke.
                    // markRaw keeps Vue from deep-proxying Fuse's internal index.
                    this.fuse = markRaw(new Fuse(this.data, FUSE_OPTIONS));
                }

                this.emitResults();
            }
        }
    },

    unmounted() {
        clearTimeout(this.debounceTimer);
    },

    methods: {
        handleFocus() {
            this.$emit('search-activated');
        },

        onChangedInput(event) {
            const value = this.clean_string(event.target.value);
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.input = value;
                this.emitResults();
            }, SEARCH_DEBOUNCE_MS);
        },

        emitResults() {
            this.$emit("filteredData", this.filterList());
        },

        clean_string(word) {
            return word.toLowerCase()
                .replaceAll(/[éêè]/g, "e")
                .replaceAll(/[áãâ]/g, "a")
                .replaceAll(/[óôõö]/g, "o")
                .replaceAll(/[ç]/g, "c")
                .replaceAll(/[íï]/g, "i")
                .replaceAll(/[ü]/g, "u")
        },

        highlight(fuseSearchResult, highlightClassName) {
            const set = (obj, path, value) => {
                const pathValue = path.split('.');
                let i;

                for (i = 0; i < pathValue.length - 1; i++) {
                    obj = obj[pathValue[i]];
                }
                obj[pathValue[i]] = value;
            };

            const generateHighlightedText = (inputText, regions) => {
                let content = '';
                let nextUnhighlightedRegionStartingIndex = 0;
                regions.forEach(region => {
                    const lastRegionNextIndex = region[1] + 1;
                    content += [
                        inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
                        `<span class="${highlightClassName}">`,
                        inputText.substring(region[0], lastRegionNextIndex),
                        '</span>',
                    ].join('');

                    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
                });
                content += inputText.substring(nextUnhighlightedRegionStartingIndex);
                return content;
            };

            for (let elt of fuseSearchResult) {
                elt.matches.forEach(match => {
                    if (match.key == "title_html") {
                        match.value = elt.item.title
                    } else {
                        match.value = elt.item.author
                    }
                })
            }
            let result = fuseSearchResult
                .filter(item => item.matches && item.matches.length)
                .map(function (elt) {
                    const item = elt.item;
                    const matches = elt.matches;
                    const highlightedItem = Object.assign({}, item);
                    matches.forEach(function (match) {
                        const key = match.key;
                        const value = match.value;
                        const indices = match.indices;
                        set(highlightedItem, key, generateHighlightedText(value, indices));
                    });
                    return highlightedItem;
                });
            return result
        },

        filterList() {
            if (this.input === "" || !this.fuse) {
                return this.plainList;
            }

            const selectedList = this.highlight(this.fuse.search(this.input), "highlight");

            for (let item of selectedList) {
                item.title_html = item.title_html.includes("highlight") ? item.title_html : item.title;
                item.author_html = item.author_html.includes("highlight") ? item.author_html : item.author
            }

            return selectedList;
        },
    }
}
</script>


<style lang="scss" scoped>
$secondary-dark-bg: #2B2B2B;

.button-and-seachbar-wrapper {
    display: flex;
    height: 3rem;
    align-items: center;
}

.wrapper {
    display: flex;
    flex-direction: column;
}

input {
    background-color: $secondary-dark-bg;
    min-width: 0;
    font-size: 16px;
    color: #f0f0f0;
    border-radius: 20px;
    border-color: #444444;
    flex-grow: 1;
    height: 90%;
    padding-left: 1rem;
}
</style>
