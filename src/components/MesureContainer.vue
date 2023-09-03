<template>
    <div class="single-chord-container" v-if="measure.length == 1">
        <ChordRender :accord="measure[0]"></ChordRender>
    </div>

    <div class="two-chords-container" v-else>
        <div class="upper-left">
            <ChordRender :accord="measure[0]"></ChordRender>
        </div>
        <div class="bottom-right">
            <ChordRender :accord="measure[1]"></ChordRender>
        </div>
        <svg>
            <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(0,0,0, 0.5); stroke-width:1" />
        </svg>
    </div>
</template>

<script>
import ChordRender from "./ChordRender.vue";

export default {
    props: ["measure"],
    components: { ChordRender }
}
</script>

<style lang="scss">
$base-font-size: 2em;
$two-chords-font-size: 0.7 * $base-font-size;
$size: 4rem;

.single-chord-container,
.two-chords-container {
    width: 4.5rem;
    height: 3rem;
    border: solid rgb(0, 0, 0) 1px;
    margin-top: -1px;
    margin-left: -1px;
    margin-bottom: 10px;
}

.single-chord-container {
    font-size: $base-font-size;
    display: flex;
    justify-content: center;
    align-items: center;
}

.two-chords-container {
    font-size: $two-chords-font-size;
    position: relative;
}

.upper-left,
.bottom-right {
    position: absolute;
    width: 100%;
    height: 50%;
}


.upper-left .chord {
    position: relative;
    top: -0.2em;
}

.bottom-right {
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: end;
    padding-right: 3%;
}

svg {
    width: 100%;
    height: 100%;
}
</style>