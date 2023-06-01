<template>
    <h1> Grille ! </h1>
    <div class="main-container">
        <div class="container-section" v-for="partie in this.parties" :key="partie">
            <h2> {{ partie }} </h2>
            <div class="grille-section">
                <div class="ligne" v-for="line in this.grille[partie]" :key="line">
                    <div class="cell" v-for="cell in line" :key=cell>
                        <SplitMesure :cell=cell></SplitMesure>
                    </div>
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
        }
    },

    created() {
        this.grille = grilleSamba.data[0]["grille"]
        this.parties = Object.keys(grilleSamba.data[0]["grille"])
    }
}

</script>

<style scoped>
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
    margin-right: 1rem;

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




<!-- <div class="accord" v-for="accord in cell.accords" :key=accord>
    <span class="accord"> {{ accord.accord }}</span>
    <span class="qualite"> {{ accord.qualite }}</span>
    <span v-if=accord.bass class="bass"> / {{ accord.bass }}</span>
</div> -->