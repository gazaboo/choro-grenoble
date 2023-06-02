<template>
    <div class="infos">
        <h1> {{ title }} </h1>
        <h2> {{ tonalite }}</h2>
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
import grilleSamba from "../assets/grillesSambas.json"
import SplitMesure from "./SplitMesure.vue"

export default {

    components: {
        SplitMesure
    },

    data() {
        return {
            grille: [],
            parties: [],
            flat_chords: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
            sharp_chords: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        }
    },

    created() {
        this.title = grilleSamba.data[0]["title"]
        this.tonalite = grilleSamba.data[0]["tonalite"]
        this.grille = grilleSamba.data[0]["grille"]
        this.parties = Object.keys(grilleSamba.data[0]["grille"])
        this.transpose_grille(1);
    },

    methods: {
        transpose_chord(chord, num_demi_tons) {
            let index = this.flat_chords.findIndex(elt => elt == chord);
            if (chord.includes("m")) {
                index = this.flat_chords.findIndex(elt => elt + "m" == chord);
            }
            let transposed_chord = this.flat_chords[(index + num_demi_tons) % 12];
            return transposed_chord;
        },

        transpose_grille(num_demi_tons) {
            for (const partie in this.grille) {
                for (const line in this.grille[partie]) {
                    for (const measure of this.grille[partie][line]) {
                        for (const accord of measure.accords) {
                            console.log(accord.accord, this.transpose_chord(accord.accord, num_demi_tons))
                        }
                    }
                }
            }
            return true;
        }
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
