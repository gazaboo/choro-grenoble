<template>
    <NavBar />
    <h1>Warning</h1>
    <p> This is a work in progress. Be patient ;) </p>
    <h2> Choro </h2>
    <p> All sheet music can be read using the MuseScore reader.</p>
    <p> You can read the music sheet, loop some parts or change speed.</p>
    <p> I am currently adding more music sheet for Bb and Eb instruments.</p>
    <h2> Samba </h2>
    <p> This part is still at initial stage.
        The aim is to provide a fast and readable way of playing music
    </p>
    <h2> Contact </h2>
    <p> Do you have any remark reagarding copyrights ?</p>
    <p> Do you have music sheets you want to be included ?</p>
    <p> Do you want to collaborate ?</p>

    <p><em>Contact : florian.dadouchi@gmail.com </em></p>
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
