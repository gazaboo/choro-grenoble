<template>
  <div class="choro-song-list-container">
    <div class="background-image"></div>
    <div class="content-wrapper">
      <NavBar :showHome="true" :showInfo="true" />
      <div class="searchbar-filter-wrapper">
        <div class="searchbar-wrapper">
          <button class="burger" @click="showFilters = !showFilters">
            <i class="material-icons">menu</i>
          </button>
          <SearchBar @filtered-data="updatedSelection" :data-to-search="data" :check-partition="true"
            class="search-bar" />
        </div>
        <FilterBar v-if='showFilters' @changed-selection="updatedSelection" :data="data" class="filter-bar"></FilterBar>
      </div>
      <div class="results-container">
        <ChoroLink class='result' v-for="(music, index) in this.filteredData" :id="index" :music="music" :key="music"
          @click="saveId(index)" />
      </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';
import NavBar from '@/components/NavBar.vue';
import listeChoros from "@/assets/liste_totale_choros.json";
import ChoroLink from '@/components/ChoroLink.vue';
import FilterBar from '@/components/FilterBar.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    NavBar,
    ChoroLink,
    FilterBar
  },

  data() {
    return {
      data: listeChoros.data.filter(itemSong => this.has_partition(itemSong)),
      filteredData: [],
      showFilters: false
    }
  },

  created() {
    this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
  },

  methods: {

    updatedSelection(filteredData) {
      this.filteredData = filteredData;
      this.backToTop();
    },

    has_partition(itemSong) {
      return Object.entries(itemSong.melody).map(entry => entry[1] != "").includes(true) ||
        Object.entries(itemSong.contracanto).map(entry => entry[1] != "").includes(true)
    },

    saveId(id) {
      localStorage.ref = id;
    },

    backToTop() {
      const element = document.getElementById('0');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: "center" });
      }
    }
  },

  mounted() {
    if (localStorage.ref) {
      this.ref = localStorage.ref;
      const element = document.getElementById(this.ref);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: "center" });
        element.classList.add('blink')
        setTimeout(() => {
          this.disabled = false
        }, 500)
        // element.classList.remove('blink')
      }
    }
  }
}
</script>


<style lang="scss">
.material-icons,
.material-symbols-rounded {
  color: black;
  font-size: 1rem;
}

.choro-song-list-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/main_page.jpeg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.searchbar-filter-wrapper {
  background-color: white;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.searchbar-wrapper {
  display: flex;
  background-color: white;
  justify-content: center;
  align-content: stretch;
  padding: 1rem;
}

.searchbar-wrapper button {
  background-color: #fff;
  border: none;
  padding: 5px;
}

.material-icons {
  font-size: 1.5rem;
}

.nav-bar {
  margin-bottom: 10px;
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-bar,
.filter-bar {
  flex: 1;
  margin: 0 5px;
}

.results-container {
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 25px;
}


.blink {
  animation: blinker 0.45s ease-in-out;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
