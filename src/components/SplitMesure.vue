<template>
    <div class="single-chord-container" v-if="cell.accords.length == 1">
        <ChordRender :accord="cell.accords[0]"></ChordRender>
    </div>

    <div class="two-chords-container" v-else-if="cell.accords.length == 2">
        <div class="upper-left">
            <ChordRender :accord="cell.accords[0]"></ChordRender>
        </div>
        <div class="bottom-right">
            <ChordRender :accord="cell.accords[1]"></ChordRender>
        </div>
        <svg>
            <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(0,0,0); stroke-width:2" />
        </svg>
    </div>
</template>

<script>
import ChordRender from "./ChordRender.vue";

export default {
    props: ["cell"],
    components: { ChordRender }
}
</script>

<style>
.single-chord-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
}

.two-chords-container {
    position: relative;
    height: 100%;
    font-size: 2.5rem;
}

.single-chord-container .qualite {
    font-size: 2rem;
}

.two-chords-container .qualite {
    font-size: 1.5rem;
}

.two-chords-container .bass {
    font-size: 1.5rem;
}

.upper-left,
.bottom-right {
    width: 75%;
    height: 50%;
    position: absolute;
}

.upper-left {
    top: 0;
    left: 0;
}

.bottom-right {
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}



svg {
    width: 100%;
    height: 100%;
}
</style>