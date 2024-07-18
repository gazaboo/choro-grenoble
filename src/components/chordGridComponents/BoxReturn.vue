<template>
    <svg class="box">
        <line x1="0" y1="10px" x2="80%" y2="10px" style="stroke:rgb(0,0,0,1); stroke-width:1" />
        <line x1="0px" y1="15px" x2="0px" y2="10px" style="stroke:rgb(0, 0, 0, 1); stroke-width:2" />
        <text x="3px" y="17px" font-size="0.25em"> {{ message }}</text>
    </svg>
</template>

<script>

export default {
    props: ["message"],
}

</script>

<style lang="scss">
.box {
    position: absolute;
    top: -20px;
}
</style>