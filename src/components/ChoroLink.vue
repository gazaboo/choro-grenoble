<template>
    <div class="itemSong">

        <SongLink :music="music"></SongLink>

        <div class="container-canto-contraconto">
            <div class="container-music-keys">
                <span class="role"> Melody </span>
                <div class="links">
                    <router-link v-for="key in this.mainThemeKeys()" :key="key" :to="{
                            name: 'SongView',
                            params: {
                                theme: 'melody',
                                instrument: key,
                                title: music.title
                            }
                        }">
                        {{ key }}
                    </router-link>
                </div>
            </div>

            <div v-if="this.secondVoiceKeys().length > 0" class="container-music-keys">
                <span class="role"> Second Voice </span>
                <div class="links">

                    <router-link v-for="key in this.secondVoiceKeys()" :key="key" :to="{
                            name: 'SongView',
                            params: {
                                theme: 'contracanto',
                                instrument: key,
                                title: music.title
                            }
                        }">
                        {{ key }}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SongLink from './SongLink.vue'

export default {
    name: 'ChoroLink',
    props: ['music', 'hasPartition'],
    components: {
        SongLink
    },
    methods: {
        mainThemeKeys() {
            const keys = Object.keys(this.music.melody)
            return keys.filter(key => this.music.melody[key])
        },
        secondVoiceKeys() {
            const keys = Object.keys(this.music.melody)
            return keys.filter(key => this.music.contracanto[key])
        }
    }
}

</script>



<style scoped>
/* Card */
.itemSong {
    width: 75%;
    border-bottom: solid green 1px;
    margin-bottom: 1rem;
    padding-bottom: 1rem;

}


/* Container qui contient les clés disponibles */
.container-music-keys {
    display: flex;
    flex-direction: row;
}

/* Liens vers la partition */
a {
    font-size: 0.75rem;
    padding: 0.25rem;
    background-color: rgb(70, 104, 19);
    border-radius: 3px;
    margin-right: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    color: white;
    transition: background-color 0.1s;
    text-align: center;
}

a:hover {
    background-color: rgb(56, 175, 58);
}



.container-canto-contraconto {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2rem;
}

.role {
    font-size: 0.75rem;
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
}

.links {
    line-height: 2rem;
}
</style>