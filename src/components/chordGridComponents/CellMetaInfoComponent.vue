<template>
    <LeftDoubleBarComponent v-if="this.hasDoubleBarLeft"></LeftDoubleBarComponent>
    <RightDoubleBarComponent v-if="this.hasDoubleBarRight"></RightDoubleBarComponent>
</template>

<script>

import LeftDoubleBarComponent from "./LeftDoubleBarComponent.vue";
import RightDoubleBarComponent from "./RightDoubleBarComponent.vue"

export default {
    props: ["measure"],
    components: { LeftDoubleBarComponent, RightDoubleBarComponent },

    data() {
        return {
            hasDoubleBarLeft: this.measure.some(chord => chord.hasDoubleBarLeft),
            hasDoubleBarRight: this.measure.some(chord => chord.hasDoubleBarRight),
            hasBoite: false,
            hasMessage: false
        }
    }
}

</script>

<style lang="scss"></style>