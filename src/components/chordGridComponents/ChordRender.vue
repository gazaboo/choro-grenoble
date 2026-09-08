<template>
    <div class="chord">
        <span class="accord"> {{ chord.fundamental }}</span>
        <div class="chord-infos">
            <span class="extension"> {{ chord.extensions }}</span>
            <span class="qualite"> {{ chord.qualite }}</span>
        </div>
        <span v-if=chord.bass :class="[true ? 'bass' : 'closedBass']"> /{{ chord.bass }}</span>
    </div>
</template>

<script>
export default {
    props: ['chord'],

    computed: {
        extensions() {
            return this.hasExtensions ? this.accord.replaceAll(/[a-z/%]/gi, '') : undefined;
        },

        offsetExtension() {
            if (this.hasExtensions && this.qualite) {
                return "0.2em";
            }
            return this.hasExtensions && !this.qualite ? "-0.5em" : "0.125em";
        },

        offsetQualite() {
            return !this.hasExtensions && this.qualite ? "0.25em" : "-0.4em";
        }

        // console.log(this.possibleExtension);
        // console.log(this.possibleExtension.length);
    }
}


</script>

<style lang="scss">
$primary-size: 0.5em;
$secondary-size : 0.5em;

// Nine of the ten families this used to import were only ever candidates in
// the commented-out list below; only Comic Neue is applied.
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300&display=swap');

.chord {

    // Alternatives tried: Annie Use Your Telescope, Delius, Klee One, Neucha, Yomogi
    font-family: 'Comic Neue', cursive;

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
    top: v-bind(offsetExtension);
}

.qualite {
    font-size: $secondary-size;
    position: relative;
    top: v-bind(offsetQualite);
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