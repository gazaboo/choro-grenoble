<template>
    <div class="chord-container" v-if="cell.accords.length == 1">
        <ChordRender :accord="cell.accords[0]"></ChordRender>
    </div>

    <div class="chord-container" v-else-if="cell.accords.length == 2">
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
.chord-container {
    position: relative;
    height: 100%;
    overflow: hidden;
}

.upper-left,
.bottom-right {
    width: 50%;
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
}

.diagonal {
    width: 100%;
    height: 0;
    border: solid black 1px;

    position: absolute;
    top: 50%;
    left: 0;

    transform: rotate(-15deg);
}

svg {
    width: 100%;
    height: 100%;
}
</style>