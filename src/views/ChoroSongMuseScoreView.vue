<template>
    <NavBar />

    <a :href=this.github> 
        <button class="btn"> Download</button>
    </a>

    <iframe ref="musescore" class="musescore" :src="this.url" frameborder="0" allowfullscreen
        allow="autoplay; fullscreen"></iframe>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';

export default {

    name: 'ChoroSongMuseScoreView',

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
        
        let url = 'https://github.com/gazaboo/choro-db/raw/main/'
        if (params.instrument === 'Eb'){
            url = url + `Saxophone_Eb/${song.author} - ${song.title} - Theme - Saxophone Eb.mxl`
        } else if (params.instrument === 'Bb'){
            url = url + `Clarinet_Bb/${song.author} - ${song.title} - Theme - Clarinet Bb.mxl`
        } else if (params.instrument === 'C'){
            url = url + `C/${song.author} - ${song.title} - Theme - C.mxl`
        }
        url = url.replaceAll(' ', '%20')
        this.github = url




    },

    mounted() {
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

 .btn {
  background-color: DodgerBlue;
  border: none;
  color: white;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
</style>
