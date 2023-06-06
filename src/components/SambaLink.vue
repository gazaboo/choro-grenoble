<script>
export default {
    name: 'SongLink',
    props: ['music']
}

</script>

<template>
    <div class="itemSong">
        <h2> {{ music.title }} </h2>
        <h3> {{ music.author }} </h3>
    </div>
</template>


<style scoped>
/* Card */
.itemSong {
    background-color: rgb(97, 163, 99);
    width: 45%;
    max-width: 300px;
    margin: 5px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 1px 1px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Titre de la musique */
h2 {
    font-size: 1rem;
    margin: 0.25rem 0 0 0.5rem;
    padding: 0;
}

h3 {
    font-size: 0.75rem;
    color: rgb(218, 218, 218);
    margin: 0 0 0.75rem 0.5rem;
    padding: 0;
}

/* Container qui contient les clés disponibles */
.container-music-keys {
    width: 50%;
    border-radius: 3px;
    font-size: 0.5rem;
    position: relative;

}

/* Liens vers la partition */
a {
    display: inline-block;
    width: 25%;
    background-color: rgb(70, 104, 19);
    border-radius: 3px;
    padding: 5px;
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
    background-color: white;
    width: 100%;
    padding: 0.2rem;
}

.role {
    font-size: 0.5rem;
    position: absolute;
    top: -1rem;
    left: 0.25rem;
    color: rgb(255, 255, 255);
}
</style>