<template>
    <NavBar />
    <div class="infos">
        <h1> {{ title }} </h1>
        <h2> {{ tonalite }}</h2>
    </div>
    <div class="controls">
        <button @click="transposeGrille(1)"> +1 </button>
        <button @click="transposeGrille(11)"> -1 </button>
        <button @click="toggleSharpBemol(to_sharp = true)"> to Sharp </button>
        <button @click="toggleSharpBemol(to_sharp = false)"> to Bemol </button>
        <button @click="resetGrille()"> Reset </button>
    </div>
    <div class="main-container">
        <div class="container-section" v-for="partie in this.parties" :key="partie">
            <h2> {{ partie }} </h2>
            <div class="grille-section">
                <div class="ligne" v-for="line in this.grille[partie]" :key="line">
                    <MesureContainer class="measure" :measure=measure v-for="measure in line" :key=measure>
                    </MesureContainer>
                </div>
                <br />
            </div>
        </div>
    </div>
</template>

<script>

import grillesSambas from "@/assets/grillesSambas.json"
import NavBar from "@/components/NavBar.vue"
import { useRoute } from 'vue-router';
import MesureContainer from "@/components/chordGridComponents/MesureContainer.vue";

var flatten = require('flat')
var unflatten = require('flat').unflatten


export default {

    name: 'GrilleSambaView',

    props: ['dataGrille'],

    components: {
        NavBar,
        MesureContainer
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

        const songData = this.getSong();
        this.tonalite = songData["tonalite"];
        this.grille = this.parseGrille(songData["grille"]);
        this.originalGrille = JSON.parse(JSON.stringify(this.grille));
        this.parties = Object.keys(songData["grille"]);
        this.doubleBarsLeft = songData["doubleBarsLeft"];
        this.doubleBarsRight = songData["doubleBarsRight"];
        this.grille = this.addMetaDataToMeasures();
        console.log(this.grille);
    },

    methods: {

        getFlatCopy(data) {
            return JSON.parse(JSON.stringify(flatten(data, { maxDepth: 4 })));
        },

        getUnflatCopy(data) {
            return JSON.parse(JSON.stringify(unflatten(data)));
        },

        getSong() {
            let song = Object.values(grillesSambas).find((itemSong) =>
                itemSong.title.toLowerCase() === this.title.toLowerCase()
            );
            return song
        },

        resetGrille() {
            this.grille = JSON.parse(JSON.stringify(this.originalGrille));
        },

        parseChord(rawChord) {
            let hasExtensions = /[^a-z/%]/gi.test(rawChord);
            return {
                "fundamental": rawChord[0],
                "qualite": rawChord.includes("m") ? "m" : null,
                "bass": rawChord.includes("/") ? rawChord.split("/")[1] : null,
                "extensions": hasExtensions ? rawChord.replaceAll(/[a-z/%]/gi, '') : null
            }
        },

        addMetaDataToMeasures() {
            let flatData = this.getFlatCopy(this.grille);

            // Add Id to all chords
            Object.values(flatData).forEach((item, i) => {
                item.id = i + 1;
            });

            // Check for double bars
            for (const key in flatData) {
                let val = flatData[key];
                if (this.doubleBarsLeft.includes(val.id)) {
                    val.hasDoubleBarLeft = true;
                }

                if (this.doubleBarsRight && this.doubleBarsRight.includes(val.id)) {
                    val.hasDoubleBarRight = true;
                }
            }
            return this.getUnflatCopy(flatData);
        },

        applyFunctionToAllChords(data, fun) {
            let flatData = this.getFlatCopy(data);
            for (let key in flatData) {
                flatData[key] = fun(flatData[key]);
            }
            return this.getUnflatCopy(flatData);
        },

        parseGrille(data) {
            return this.applyFunctionToAllChords(data, this.parseChord);
        },

        transposeGrille(num_demi_tons) {
            this.grille = this.applyFunctionToAllChords(this.grille, chord => {
                chord.fundamental = this.transposeChord(chord.fundamental, num_demi_tons);
                chord.bass = chord.bass ? this.transposeChord(chord.bass, num_demi_tons) : null;
                return chord;
            });
        },

        toggleSharpBemol(to_sharp) {
            this.grille = this.applyFunctionToAllChords(this.grille, chord => {
                chord.fundamental = this.sharpenerChord(chord.fundamental, to_sharp);
                chord.bass = chord.bass ? this.sharpenerChord(chord.bass, to_sharp) : null;
                return chord;
            });
        },

        transposeChord(chord, num_demi_tons) {
            if (chord == '%') {
                return chord;
            }
            let isMinor = chord.includes("m");
            let index = this.flat_chords.findIndex(elt => (isMinor ? elt + "m" : elt) == chord);
            let transposed_chord = this.flat_chords[(index + num_demi_tons) % 12];
            return isMinor ? transposed_chord + "m" : transposed_chord;
        },


        sharpenerChord(chord, to_sharp) {

            if (chord == "%") {
                return chord;
            }

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
    }
}

</script>

<style lang='scss' >
$nbre-measure-per-line: 4;

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
    width: 100vw;
    border: solid rgb(0, 0, 0) 1px;
    padding: 1vw;

    @media only screen and (min-width : 640px) {
        width: 80vw;
    }

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
    // height: 4em;
}
</style>
