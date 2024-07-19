<template>
    <NavBar />
    
    <a :href=this.github> 
        <button class="btn"> Download</button>
    </a>

    <MxlViewer  :path=this.path />

</template>

<script>

import NavBar from "@/components/NavBar.vue";
import listeChoros from "../assets/liste_totale_choros.json";
import { useRoute } from 'vue-router';
import MxlViewer from '@/components/MxlViewer.vue'

export default {

    name: 'ChoroSongOSMDView',

    components: {
        NavBar,
        MxlViewer
    },

    data() {
        return {
            url: "",
            title: "",
            otherUrls: [],
            path:"",
            song:undefined
        }
    },

    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;
        this.song = this.getSong();
        this.url = this.song[params.theme][params.instrument];
        this.youtube = this.song.youtube.filter(url => url != "");
        this.path = 'C/' + this.song.author + ' - ' + this.song.title + ' - Theme - ' + params.instrument + '.mxl'
        
        let url = 'https://github.com/gazaboo/choro-db/raw/main/'
        if (params.instrument === 'Eb'){
            url = url + `Saxophone_Eb/${this.song.author} - ${this.song.title} - Theme - Saxophone Eb.mxl`
        } else if (params.instrument === 'Bb'){
            url = url + `Clarinet_Bb/${this.song.author} - ${this.song.title} - Theme - Clarinet Bb.mxl`
        } else if (params.instrument === 'C'){
            url = url + `C/${this.song.author} - ${this.song.title} - Theme - C.mxl`
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
