<template>
  <div class="choro-song-list-container">
    <div class="background-image"></div>
    <div class="content-wrapper">
      <NavBar :showHome="true" :showInfo="true" />
      <SearchBar @filtered-data="updatedSelection" :data-to-search="data" :check-partition="true" class="search-bar" />
      <FilterBar @changed-selection="updatedSelection" :data="data" class="filter-bar"></FilterBar>
      <div class="results-container">
        <div class="container-fluid">
          <ChoroLink v-for="(music, index) in this.filteredData" :id="index" :music="music" :key="music"
            @click="saveId(index)" />
        </div>
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


<style scoped lang="scss">
.choro-song-list-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/main_page.jpeg');
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: -1;
}

.content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
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
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
