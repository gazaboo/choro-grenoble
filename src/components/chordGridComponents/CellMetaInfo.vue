<template>
    <LeftDoubleBarComponent v-if="this.hasDoubleBarLeft"></LeftDoubleBarComponent>
    <RightDoubleBarComponent v-if="this.hasDoubleBarRight"></RightDoubleBarComponent>
    <BoxReturn v-if="this.hasBox" :message="this.boxMessage"></BoxReturn>
</template>

<script>

import BoxReturn from "./BoxReturn.vue";
import LeftDoubleBarComponent from "./LeftDoubleBarComponent.vue";
import RightDoubleBarComponent from "./RightDoubleBarComponent.vue"

export default {
    props: ["measure"],
    components: { LeftDoubleBarComponent, RightDoubleBarComponent, BoxReturn },

    data() {
        return {
            hasDoubleBarLeft: this.measure.some(chord => chord.hasDoubleBarLeft),
            hasDoubleBarRight: this.measure.some(chord => chord.hasDoubleBarRight),
            hasBox: this.measure.some(chord => chord.hasBox),
            boxMessage: ''
        }
    },

    created() {
        if (this.hasBox) {
            this.boxMessage = this.measure.find(elt => elt.boxMessage).boxMessage;
        }
    }
}

</script>

<style lang="scss"></style>