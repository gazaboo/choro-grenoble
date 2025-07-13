<template>
    <div class="wrapper">

        <div class="button-and-seachbar-wrapper">
            <router-link class="navbar-brand" to="/">
                CHORO
            </router-link>
            <input @input="onChangedInput" type="search" placeholder="Search by song name or author..."
                aria-label="Search">
            <!-- <button class="burger" @click="showFilters = !showFilters">
                <i class="material-icons">menu</i>
            </button> -->
            <div class="nav-links" :class="{ 'nav-links-mobile': mobileMenuOpen }">
                <router-link class="nav-link" to="/">Home</router-link>
                <router-link class="nav-link" to="/info">Info</router-link>
                <router-link class="nav-link" to="/choro">List</router-link>
            </div>
        </div>
        <!-- <FilterBar v-if='showFilters' class="filter-bar" @selectedAuthors="handleSelectedAuthors" :data="dataToSearch">
        </FilterBar> -->
    </div>
</template>


<script>
import Fuse from 'fuse.js'
// import FilterBar from './FilterBar.vue';

export default {

    props: ['dataToSearch'],
    emits: ['filteredData'],
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

.navbar-brand {
    color: #f0f0f0;
    font-size: 2rem;
    background-color: #0000;
}


.nav-item {
    display: flex;
    justify-content: center;
    align-items: stretch;
}

.nav-links {
    display: flex;
    align-items: center;
    justify-content: stretch;
}

.nav-link {
    color: #f0f0f0;
    background-color: #333;
    border-radius: 20px;
    margin: 0 5px;

    display: flex; // Ensures text is centered inside the link
    align-items: center;
    justify-content: center;
    height: 100%; // Optional: fill parent height
    text-align: center;
}

.button-and-seachbar-wrapper {
    display: flex;
    height: 3rem;
    align-items: center;
}

.material-icons,
.material-symbols-rounded {
    font-size: 1.3em;
}

.burger {
    background-color: #333;
    border: none;
    border-radius: 3px;
    width: 2rem;
    margin-right: 0.5rem;
    color: #f0f0f0;
}

.wrapper {
    display: flex;
    flex-direction: column;
}

form {
    padding: 0 !important;
}

.items {
    display: flex;
    flex-wrap: wrap;
}

.highlight {
    font-weight: 700;
    color: $secondary-text-color;
}

input {
    background-color: $secondary-dark-bg;
    font-size: 16px;
    color: #f0f0f0;
    // border: none;
    border-radius: 20px;
    border-color: #444444;
    // box-shadow: rgba(22, 193, 36, 0.25) 0px 2px 5px -1px,
    //     rgba(32, 167, 23, 0.3) 0px 1px 3px -1px;
    flex-grow: 1;
    padding-left: 1rem;
    height: 90%;
}


.form-check-input {
    width: 1rem;
    height: 1rem;
    padding: 0;
}
</style>
