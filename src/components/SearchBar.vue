<template>
    <div class="container-fluid">
        <form class="d-flex flex-fill">
            <input @input="onChangedInput" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        </form>
        <div class="filters">
            <div class="form-check form-check-inline">
                <input @input="onChangedFilters" class="form-check-input" type="checkbox" id="top30" value="top30" />
                <label class="form-check-label" for="top30">Top 30 Grenoble</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="chantiers" value="chantiers"
                    @input="onChangedFilters" />
                <label class="form-check-label" for="chantiers">Chantiers</label>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    emits: ["changedInput", "changedFilters"],

    methods: {
        onChangedInput(event) {
            this.$emit('changedInput', event.target.value)
        },

        onChangedFilters(event) {
            this.$emit('changedFilters', event.target.value)
        },
    }
}
</script>

 
<style>
input {
    display: block;
    margin: 20px auto;
    padding: 10px 45px;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}


.form-check-input {
    width: 1rem;
    height: 1rem;
    padding: 0;
}
</style>