<template>
    <NavBar />
    <h1>Warning</h1>
    <p> This is a work in progress. Be patient ;) </p>
    <h2> Choro </h2>
    <p> All sheet music can be read using the MuseScore reader.
        <br>
        You can read the music sheet as well as loop some parts or change speed.
    </p>
    <h2> Samba </h2>
    <p> This part is still at initial stage.
        The aim is to provide a fast and readable way and playing music
    </p>
    <h2> Contact </h2>
    <p> Do you have any remark reagarding copyrights ?
        <br>
        Do you have music sheets you want to be included ?
        <br>
        Do you want to collaborate ?
    </p>
    <p>
        <em>Contact : florian.dadouchi@gmail.com </em>
    </p>
</template>
  
<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'HomeView',
    components: {
        NavBar
    }
}

</script>
