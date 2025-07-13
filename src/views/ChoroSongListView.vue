<template>
  <div class="choro-song-list-container">
    <div class="background-image"></div>
    <div class="content-wrapper">
      <!-- <NavBar :showHome="true" :showInfo="true" /> -->
      <SearchBar @filtered-data="updatedSelection" :data-to-search="data" :check-partition="true" class="search-bar" />
      <CategoryFilter :active-category="activeCategory" @category-changed="handleCategoryChange" />
      <div v-if="activeCategory === 'Songs'" class="results-container">
        <ChoroLink class="result" v-for="(music, index) in filteredData" :id="index" :music="music" :key="music"
          @click="openSongModal(music)" />
      </div>
      <div v-if="activeCategory === 'Artists'" class="results-container">
        <div v-for="(author, index) in this.uniqueAuthors" :id="index" :key="author">
          <AuthorCard :author="author" :id="index" class='result' />
        </div>

      </div>
    </div>
    <div v-if="showSongModal" class="modal-overlay" @click.self="closeSongModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeSongModal" aria-label="Close">&times;</button>
        <ChoroCard :music="selectedSong" class='result' />
      </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import SearchBar from '@/components/SearchBar.vue';
import listeChoros from "@/assets/liste_totale_choros.json";
import ChoroLink from '@/components/ChoroLink.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import AuthorCard from '@/components/AuthorCard.vue'
import ChoroCard from '@/components/ChoroCard.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    ChoroLink,
    CategoryFilter,
    AuthorCard,
    ChoroCard
  },

  data() {
    return {
      data: listeChoros.data.filter(itemSong => this.has_partition(itemSong)),
      filteredData: [],
      showFilters: false,
      activeCategory: 'Songs',
      showSongModal: false,      // <-- add this
      selectedSong: null         // <-- add this
    }
  },

  created() {
    this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
    this.uniqueAuthors = [...new Set(this.data.map(elt => elt.author))]
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
    },

    handleCategoryChange(category) {
      this.activeCategory = category;
    },

    getSongsFromAuthor(author) {
      return this.data.filter(elt => elt.author == author)
    },

    openSongModal(song) {
      this.selectedSong = song;
      this.showSongModal = true;
    },

    closeSongModal() {
      this.showSongModal = false;
      this.selectedSong = null;
    },


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
      }
    }
  }
}
</script>


<style lang="scss">
.choro-song-list-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #f0f0f0;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: blur(5px);
}

.content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.search-bar {
  margin: 10px;
}

.results-container {
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 20px;
}

.blink {
  animation: blinker 0.45s ease-in-out;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #f0f0f0;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
