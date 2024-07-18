<template>
    <NavBar />
    <!-- <div v-for='(key, url) of others' :key='key' class="buttons"> {{ key }} {{ url }}</div> -->

    <router-link v-for="key of otherKeys" :key="key" :to="{
        name: 'ChoroSongView',
        params: {
            theme: 'melody',
            instrument: key,
            title: this.title
        }
    }">
        {{ key }}
    </router-link>
    <iframe ref="musescore" class="musescore" :src="this.url" frameborder="0" allowfullscreen
        allow="autoplay; fullscreen"></iframe>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';

export default {

    name: 'ChoroSongView',

    data() {
        return {
            url: "",
            title: "",
            otherUrls: []
        }
    },

    components: {
        NavBar
    },
    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;
        const song = this.getSong();
        this.url = song[params.theme][params.instrument];
        this.youtube = song.youtube.filter(url => url != "");
    },

    mounted() {
        var iframe = document.getElementsByClassName('hei_M')
        console.log(" IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ");
        console.log(iframe)
        const musescoreFrame = this.$refs.musescore;

        // Add a load event listener to the iframe
        musescoreFrame.addEventListener("load", () => {
            // Delay the execution of your code
            setTimeout(() => {
                // Access the iframe content
                const contentDoc = musescoreFrame.contentDocument;

                // Now you can manipulate the content inside the iframe
                console.log(contentDoc);
            }, 2000); // Adjust the delay time as needed
        });
    },

    methods: {
        getSong() {
            let song = listeChoros.data.find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        }
    }
}
</script>



<style lang="scss"> .musescore {
     width: 80vw;
     height: 90vh;

     @media screen and (max-width: 600px) {
         position: absolute;
         left: 2vw;
         width: 95vw;
         height: 130vh;

     }
 }
</style>

        <!-- <div class="filter-bar-buttons">
            <span class="filter-bar-title">Explore</span>
            <a class="custom-collapse-btn" type="button" data-bs-toggle="collapse" data-bs-target="#authors"
                aria-expanded="false" aria-controls="authors">
                Youtube
            </a>
        </div> -->
        <!-- <div class="authors-container collapse" id="authors">
            <div class="form-check form-check-inline author-link" v-for="url of this.youtube" :key="url">
                <iframe width="560" height="315" :src="url" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>
            </div>
            <div v-if="!this.youtube.length">
                No Video yet
            </div>
        </div> -->