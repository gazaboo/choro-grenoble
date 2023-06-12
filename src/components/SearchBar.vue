<template>
    <form class="container-fluid d-flex flex-fill mx-3">
        <input @input="onChangedInput" class="form-control mt-0" type="search"
            placeholder="Search by song name or author..." aria-label="Search">
    </form>
</template>

<script>

import Fuse from 'fuse.js'

export default {

    props: ['dataToSearch', 'checkPartition'],

    emits: ['filteredData'],

    data() {
        return {
            input: "",
            filteredList: [],
            data: []
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

        clean_string(word) {
            return word.toLowerCase()
                .replaceAll(/[éêè]/g, "e")
                .replaceAll(/[áãâ]/g, "a")
                .replaceAll(/[óôõö]/g, "o")
                .replaceAll(/[ç]/g, "c")
                .replaceAll(/[íï]/g, "i")
                .replaceAll(/[ü]/g, "u")
        },

        // getGrenobleSelection(name) {
        //     let filteredList = [];
        //     for (let songName of listeGrenoble[name]) {
        //         let found = this.data.find(itemSong => itemSong.title == songName)
        //         if (found) {
        //             filteredList.push(found);
        //         }
        //     }
        //     return filteredList;
        // },

        // has_partition(itemSong) {
        //     return Object.entries(itemSong.melody).map(entry => entry[1] != "").includes(true) ||
        //         Object.entries(itemSong.contracanto).map(entry => entry[1] != "").includes(true)
        // },

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

 
<style>
.items {
    display: flex;
    flex-wrap: wrap;
}

.error {
    min-width: 200px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    background-color: tomato;
}

.highlight {
    color: aquamarine;
}

input {
    display: block;
    margin: 20px auto;
    padding: 10px 45px;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}


.form-check-input {
    width: 1rem;
    height: 1rem;
    padding: 0;
}
</style>









<!-- 
filterByQueryOld2(selectedList) {
    let exploded_input = this.input.split("").filter(letter => letter != " ");
    let map = new Map();

    for (let itemSong of selectedList) {
        let fullName = this.clean_string(itemSong.title + " " + itemSong.author);
        if (fullName.includes(this.input)) {
            map.set(fullName, 2);
        } else {
            let num_of_match = 0;
            for (let letter of exploded_input) {
                let hasMatch = fullName.includes(letter);
                num_of_match = hasMatch ? num_of_match + 1 : num_of_match;
            }

            let ratio = num_of_match / exploded_input.length;
            map.set(fullName, ratio);
        }
    }

    map = new Map([...map].sort((a, b) => a[1] < b[1]));

    console.log(map)
    return selectedList;
},

filterByQueryOld(selectedList) {
    selectedList = selectedList.filter(itemSong =>
        this.clean_string(itemSong.title).includes(this.input)
        || this.clean_string(itemSong.author).includes(this.input)
    );
    return selectedList;
}, -->