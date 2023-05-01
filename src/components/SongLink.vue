<script>
export default {
    name: 'SongLink',
    props: ['music'],
    computed: {
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

<template>
    <div class="item song">
        <h2> {{ [music.title, music.author].join(" - ") }} </h2>
        <div class="container-music-keys">
            <span> Chant </span>
            <router-link v-for="key in mainThemeKeys" :key="key" :to="{
                    name: 'songView',
                    params: {
                        theme: 'melody',
                        instrument: key,
                        title: music.title
                    }
                }">
                {{ key }}
            </router-link>
        </div>

        <div class="container-music-keys">
            <span> Contracanto </span>
            <router-link v-for="key in secondVoiceKeys" :key="key" :to="{
                    name: 'songView',
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
</template>


<style scoped>
h2 {
    font-size: 1rem;
    padding: 3px;
    margin: 3px;
}

.container-music-keys {
    display: inline-block;
    background-color: rgb(64, 128, 0);
    padding: 1px;
    border: solid rgb(24, 135, 24) 1px;
    border-radius: 3px;
    font-size: 0.5rem;
    margin-right: 5px;
}

a {
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
    margin-right: 5px;
    text-decoration: none;
    cursor: pointer;
    color: white;
    transition: background-color 0.1s;
}

a:hover {
    background-color: rgb(211, 255, 212);
}

.song {
    background-color: rgb(97, 163, 99);
}

.song:hover {
    background-color: rgb(156, 185, 90);
}

.item {
    width: 350px;
    margin: 0 auto 10px auto;
    padding: 3px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.item:hover {
    box-shadow: rgba(209, 205, 82, 0.3) 0px 1px 3px 0px,
        rgba(209, 205, 82, 0.18) 0px 1px 2px 0px;
}
</style>