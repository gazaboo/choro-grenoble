<template>
    <form class="container-fluid d-flex flex-fill">
        <input @input="onChangedInput" class="form-control mt-0" type="search"
            placeholder="Search by song name or author..." aria-label="Search">
    </form>
</template>


<script>
import Fuse from 'fuse.js'
export default {

    props: ['dataToSearch'],

    emits: ['filteredData'],

    data() {
        return {
            input: "",
            filteredList: [],
            data: [],
            fuse: null
        }
    },

    created() {
        this.data = this.dataToSearch.map((item, index) => {
            return {
                ...item, // spread operator to copy all fields from the original object
                id: index + 1,
                title_clean: this.clean_string(item.title),
                author_clean: this.clean_string(item.author)
            };
        });

        this.filteredList = this.filterList();
    },

    methods: {
        onChangedInput(event) {
            this.input = this.clean_string(event.target.value);
            let clonedOriginalData = JSON.parse(JSON.stringify(this.data));
            this.filteredList = this.filterList(clonedOriginalData);
            this.filteredList = this.filteredList.map(this.highlight_text)
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

        highlight_text(item) {
            if (this.input) {
                const regex = new RegExp(`(${this.input.split('').join('|')})`, 'gi');
                item.title = item.title.replace(regex, '<span class="highlight">$1</span>');
                item.author = item.author.replace(regex, '<span class="highlight">$1</span>');
            }
            return item;
        },

        filterList(data) {
            this.filteredList = []

            if (this.input == "") {
                return this.data
            }

            this.filteredList = data.filter(itemSong => {
                return itemSong.title_clean.startsWith(this.input) || itemSong.author_clean.startsWith(this.input)
            })

            let remaining = data.filter(itemSong => {
                return (itemSong.title_clean.includes(this.input) || itemSong.author_clean.includes(this.input)) &&
                    !this.filteredList.includes(itemSong)
            })

            this.filteredList = this.filteredList.concat(remaining)

            // Fuzzy search only if needed
            if (this.filteredList.length == 0) {
                let clonedOriginalData = JSON.parse(JSON.stringify(this.data));
                this.filteredList = this.fuzzySearch(clonedOriginalData);
            }

            return this.filteredList;
        },

        fuzzySearch(data) {
            let filteredData = JSON.parse(JSON.stringify(data));

            const options = {
                shouldSort: true,
                includeMatches: true,
                keys: ['title_clean', 'author_clean']
            }
            let fuse = new Fuse(filteredData, options)
            filteredData = fuse.search(this.input)
            filteredData = filteredData.map(item => item.item)
            return filteredData
        }
    }
}
</script>


<style>
form {
    padding: 0 !important;
}

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
        rgba(18, 187, 35, 0.06) 0px 1px 2px 0px;
    background-color: tomato;
}

.highlight {
    font-weight: 700;
    color: rgba(46, 91, 1, 0.685);
}

input {
    display: block;
    margin: 0;
    padding: 10px 45px;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(22, 193, 36, 0.25) 0px 2px 5px -1px,
        rgba(32, 167, 23, 0.3) 0px 1px 3px -1px;
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