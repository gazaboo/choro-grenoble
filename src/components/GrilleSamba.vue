<template>
    <div class="infos">
        <h1> {{ title }} </h1>
        <h2> {{ tonalite }}</h2>
    </div>
    <div class="controls">
        <button @click="transpose_grille(1)"> +1 </button>
        <button @click="transpose_grille(11)"> -1 </button>
        <button @click="reset_grille()"> reset ton </button>

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
        this.original_tonalite = grilleSamba.data[0]["tonalite"]
        this.grille = grilleSamba.data[0]["grille"]
        this.original_grille = JSON.parse(JSON.stringify(this.grille));
        this.parties = Object.keys(grilleSamba.data[0]["grille"])
    },

    methods: {
        reset_grille() {
            this.grille = JSON.parse(JSON.stringify(this.original_grille));
        },

        transpose_chord(chord, num_demi_tons) {
            let isMinor = chord.includes("m");
            let index = this.flat_chords.findIndex(elt => (isMinor ? elt + "m" : elt) == chord);
            let transposed_chord = this.flat_chords[(index + num_demi_tons) % 12];
            return isMinor ? transposed_chord + "m" : transposed_chord;
        },

        transpose_grille(num_demi_tons) {
            for (const partie in this.grille) {
                for (const line in this.grille[partie]) {
                    for (let measure_index = 0; measure_index < this.grille[partie][line].length; measure_index++) {
                        for (let chord_index = 0; chord_index < this.grille[partie][line][measure_index].accords.length; chord_index++) {
                            let chord = this.grille[partie][line][measure_index].accords[chord_index];
                            this.grille[partie][line][measure_index].accords[chord_index].accord = this.transpose_chord(chord.accord, num_demi_tons);
                            if (chord.bass) {
                                this.grille[partie][line][measure_index].accords[chord_index].bass = this.transpose_chord(chord.bass, num_demi_tons);
                            }

                        }
                    }
                }
            }
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
