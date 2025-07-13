<template>
    <div class="wrapper">
        <div class="button-and-seachbar-wrapper">
            <input @focus="handleFocus" @input="onChangedInput" type="search" placeholder="Search..."
                aria-label="Search">
        </div>
    </div>
</template>


<script>
import Fuse from 'fuse.js'

export default {

    props: ['dataToSearch'],
    emits: ['filteredData', 'search-activated'],
    components: {
        // FilterBar
    },

    data() {
        return {
            input: "",
            filteredList: [],
            data: [],
            selectedAuthors: [],
            showFilters: false

        }
    },

    created() {

        this.data = this.dataToSearch.map((item, index) => {
            return {
                ...item, // spread operator to copy all fields from the original object
                id: index + 1,
                title_html: this.clean_string(item.title),
                author_html: this.clean_string(item.author)
            };
        });

        this.filteredList = this.filterList();
    },

    methods: {
        handleFocus() {
            this.$emit('search-activated');
        },

        onChangedInput(event) {
            this.input = this.clean_string(event.target.value);
            this.filteredList = this.filterList();
            this.$emit("filteredData", this.filteredList)
        },

        handleSelectedAuthors(selectedAuthors) {
            this.selectedAuthors = selectedAuthors;
            this.filterResults();
        },

        filterResults() {
            let results = this.filterList();
            if (this.selectedAuthors.length > 0) {
                results = results.filter(item => this.selectedAuthors.includes(item.author));
            }
            this.$emit("filteredData", results);
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

        filterByQuery(selectedList) {
            const options = {
                includeScore: true,
                shouldSort: true,
                includeMatches: true,
                keys: ['title_html', 'author_html']
            }
            const fuse = new Fuse(selectedList, options)
            let result = fuse.search(this.input)
            return result
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

            if (this.input == "") {
                let clone = JSON.parse(JSON.stringify(this.data))
                clone.forEach(elt => {
                    elt.title_html = elt.title;
                    elt.author_html = elt.author
                })
                return clone
            }
            let selectedList = this.data;
            selectedList.sort((a, b) => (a.title > b.title) ? 1 : -1);

            if (this.input) {
                selectedList = this.filterByQuery(selectedList);
                selectedList = this.highlight(selectedList, "highlight");
            }

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
