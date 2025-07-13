<template>
    <div class="filter-container">
        <button v-for="category in categories" :key="category" class="filter-pill"
            :class="{ active: activeCategory === category }" @click="selectCategory(category)">
            {{ category }}
        </button>
    </div>
</template>

<script>
export default {
    props: {
        activeCategory: {
            type: String,
            default: 'Songs'
        }
    },

    emits: ['category-changed'],

    data() {
        return {
            categories: ['Songs', 'Artists'],
        };
    },

    methods: {
        selectCategory(category) {
            this.$emit('category-changed', category);
        }
    }
};
</script>

<style lang="scss" scoped>
$primary-dark-bg: #1A1A1A;

.filter-container {
    display: flex;
    white-space: nowrap;
    padding: 0 0 5px 5px;
    gap: 8px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Hides scrollbar for Chrome, Safari and Opera */
.filter-container::-webkit-scrollbar {
    display: none;
}

.filter-pill {
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    transition: background-color 0.3s ease, color 0.3s ease;

    background-color: $primary-dark-bg;
    color: #f0f0f0;
}

.filter-pill.active {
    background-color: #1ed760;
    color: #000;
    font-weight: 600;
}
</style>