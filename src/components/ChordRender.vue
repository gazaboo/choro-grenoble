<template>
    <div class="chord">
        <span class="accord"> {{ accord.accord }}</span>
        <div class="chord-infos">
            <span class="extension"> {{ accord.extensions }}</span>
            <span class="qualite"> {{ accord.qualite }}</span>
        </div>
        <span v-if=accord.bass :class="[accord.qualite ? 'bass' : 'closedBass']"> /{{ accord.bass }}</span>
    </div>
</template>

<script>
export default {
    props: ['accord'],
    data() {
        return {
            offset_extension: this.accord.extensions && !this.accord.qualite ? "-0.5em" : "0.15em",
            offset_qualite: !this.accord.extensions && this.accord.qualite ? "0.4em" : "-0.15em",
        }
    }
}


</script>

<style lang="scss">
$primary-size: 1em;
$secondary-size : 0.5em;


.chord {
    font-family: 'Comfortaa', cursive;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}

.chord-infos {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.accord {
    font-size: 1em;
}

.extension {
    font-size: $secondary-size;
    position: relative;
    top: v-bind(offset_extension);
}

.qualite {
    font-size: $secondary-size;
    position: relative;
    top: v-bind(offset_qualite);
}

.bass,
.closedBass {
    position: relative;
    font-size: 0.7em;
}

.bass {
    top: 0.15em;
}

.closedBass {
    top: 0.25em;
}
</style>