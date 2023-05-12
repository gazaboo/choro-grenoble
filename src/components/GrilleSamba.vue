<template>
    <h1> Grille ! </h1>
    <div class="main-container">
        <div class="container-section" v-for="partie in this.parties" :key="partie">
            <h2> {{ partie }} </h2>
            <div class="grille-section">
                <div class="ligne" v-for="line in this.grille[partie]" :key="line">
                    <div class="cell" v-for="cell in line" :key=cell>
                        <span class="accord"> {{ cell.accord }}</span>
                        <span class="qualite"> {{ cell.qualite }}</span>
                        <span v-if=cell.bass class="bass"> / {{ cell.bass }}</span>
                    </div>
                </div>
                <br />
            </div>
        </div>
    </div>
</template>

<script>
import grilleSamba from "../assets/grillesSambas.json"

export default {
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
    padding: 1rem;
    width: 25%;
    height: 5rem;
    text-align: center;
}

.accord {
    font-family: 'Comfortaa', cursive;
    font-size: 2rem;
}

.bass {
    font-family: 'Comfortaa', cursive;
    font-size: 1.5rem;
}

.qualite {
    font-size: 1rem;
    font-family: 'Comfortaa', cursive;
    position: relative;
    top: -1rem;
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