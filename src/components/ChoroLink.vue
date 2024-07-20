<template>
    <button @click="toggleMuseScores" class="itemSong">

        <SongLink :music="music"></SongLink>
        <transition name="fade">

            <div v-if="showMuseScores" lass="container-canto-contracanto">
                <div class="container-musescores">
                    <span class="role"> MuseScore </span>
                    <div class="links">
                        <router-link v-for="key in this.mainThemeKeys()" :key="key" :to="{
                            name: 'ChoroSongMuseScoreView',
                            params: {
                                theme: 'melody',
                                instrument: key,
                                title: music.title,
                                author: music.author
                            }
                        }">
                            {{ key }}
                        </router-link>
                    </div>
                    <div class="container-musescores">

                        <span class="role"> OSMD </span>
                        <div class="links">

                            <router-link v-for="key in this.mainThemeKeys()" :key="key" :to="{
                                name: 'ChoroSongOSMDView',
                                params: {
                                    theme: 'melody',
                                    instrument: key,
                                    title: music.title,
                                    author: music.author
                                }
                            }">
                                {{ key }}
                            </router-link>
                        </div>

                    </div>
                </div>

                <div v-if="this.secondVoiceKeys().length > 0" class="container-musescores">
                    <span class="role"> Second Voice </span>
                    <div class="links">

                        <router-link v-for="key in this.secondVoiceKeys()" :key="key" :to="{
                            name: 'ChoroSongMuseScoreView',
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
        </transition>




    </button>
</template>

<script>
import SongLink from './SongLink.vue'

export default {
    name: 'ChoroLink',
    props: ['music', 'hasPartition'],
    components: {
        SongLink
    },

    data() {
        return {
            showMuseScores: false,
        }
    },

    methods: {
        mainThemeKeys() {
            const keys = Object.keys(this.music.melody)
            return keys.filter(key => this.music.melody[key])
        },
        secondVoiceKeys() {
            const keys = Object.keys(this.music.melody)
            return keys.filter(key => this.music.contracanto[key])
        },
        toggleMuseScores() {
            console.log("toggleMuseScores called");
            this.showMuseScores = !this.showMuseScores;
        }
    }
}

</script>



<style scoped lang="scss">
/* Card */
.itemSong {
    width: 100%;
    background-color: #fff;
    border: none;
    border-bottom: solid green 1px;
    padding-bottom: 1rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: baseline;

    @media (min-width: 600px) {
        column-gap: 10px;
        justify-content: space-between;
    }
}

.itemSong:hover {
    background-color: rgba(0, 255, 0, 0.03);
}

/* Container qui contient les clés disponibles */
.container-musescores {
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



.container-canto-contracnto {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2rem;
}

.role {
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
}

.links {
    line-height: 2rem;
}

.fade-enter-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-active {
    transition: opacity 0s ease, transform 0s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>