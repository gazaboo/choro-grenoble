<template>
    <NavBar />
    <div class="infos">
        <h1> {{ title }} </h1>
        <h2> {{ tonalite }}</h2>
    </div>
    <div class="controls">
        <button @click="transpose_grille(1)"> +1 </button>
        <button @click="transpose_grille(11)"> -1 </button>
        <button @click="toggle_sharp_bemol(to_sharp = true)"> to Sharp </button>
        <button @click="toggle_sharp_bemol(to_sharp = false)"> to Bemol </button>
        <button @click="reset_grille()"> Reset </button>
    </div>
    <div class="main-container">
        <div class="container-section" v-for="partie in this.parties" :key="partie">
            <h2> {{ partie }} </h2>
            <div class="grille-section">
                <div class="ligne" v-for="line in this.grille[partie]" :key="line">
                    <SplitMesure class="cell" :cell=cell v-for="cell in line" :key=cell></SplitMesure>
                </div>
                <br />
            </div>
        </div>
    </div>
</template>

<script>

import grillesSambas from "@/assets/grillesSambas.json"
import SplitMesure from "@/components/SplitMesure.vue"
import NavBar from "@/components/NavBar.vue"
import { useRoute } from 'vue-router';

export default {

    name: 'GrilleSambaView',

    props: ['dataGrille'],

    components: {
        SplitMesure,
        NavBar
    },

    data() {
        return {
            grille: [],
            parties: [],
            flat_chords: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
            sharp_chords: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
            title: "",
        }
    },

    created() {
        const route = useRoute();
        const params = route.params;
        this.title = params.title;
        const song = this.getSong();
        this.tonalite = song["tonalite"]
        this.original_tonalite = song["tonalite"]
        this.grille = song["grille"]
        this.original_grille = JSON.parse(JSON.stringify(this.grille));
        this.parties = Object.keys(song["grille"])
    },

    methods: {

        getSong() {
            let song = Object.values(grillesSambas).find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        },

        reset_grille() {
            this.grille = JSON.parse(JSON.stringify(this.original_grille));
        },

        transpose_chord(chord, num_demi_tons) {
            let isMinor = chord.includes("m");
            let index = this.flat_chords.findIndex(elt => (isMinor ? elt + "m" : elt) == chord);
            let transposed_chord = this.flat_chords[(index + num_demi_tons) % 12];
            return isMinor ? transposed_chord + "m" : transposed_chord;
        },

        chord_mapper(context) {
            for (const partie in this.grille) {
                for (const line in this.grille[partie]) {
                    for (let measure_index = 0; measure_index < this.grille[partie][line].length; measure_index++) {
                        for (let chord_index = 0; chord_index < this.grille[partie][line][measure_index].accords.length; chord_index++) {
                            let chord = this.grille[partie][line][measure_index].accords[chord_index];
                            this.grille[partie][line][measure_index].accords[chord_index].accord = context.fn(chord.accord, context.arg);
                            if (chord.bass) {
                                this.grille[partie][line][measure_index].accords[chord_index].bass = context.fn(chord.bass, context.arg);
                            }
                        }
                    }
                }
            }
        },

        transpose_grille(num_demi_tons) {
            this.chord_mapper({
                fn: this.transpose_chord,
                arg: num_demi_tons
            })
        },

        sharpener(chord, to_sharp) {
            if ((to_sharp && chord.includes("#")) ||
                !to_sharp && chord.includes("b")) {
                return chord
            }

            let isMinor = chord.includes("m");

            let index = to_sharp ?
                this.flat_chords.findIndex(elt => (isMinor ? elt + "m" : elt) == chord)
                : this.sharp_chords.findIndex(elt => (isMinor ? elt + "m" : elt) == chord)

            let sharp_chord = to_sharp ?
                this.sharp_chords[index]
                : this.flat_chords[index];

            return isMinor ? sharp_chord + "m" : sharp_chord;
        },

        toggle_sharp_bemol(to_sharp) {
            this.chord_mapper({
                fn: this.sharpener,
                arg: to_sharp
            })
        },
    }
}

</script>

<style scoped>
.infos {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.main-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-start;
    width: 80vw;
    border: solid black 1px;
}

.cell {
    border: solid black 1px;
    padding: 0;
    width: 10rem;
    height: 10rem;
    text-align: center;
    margin-bottom: 1rem;

}

.grille-section {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.container-section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 1rem;
}

.ligne {
    display: flex;
    flex-direction: row;
}
</style>
