<template>
  <div class="choro-song-list-container">
    <div class="content-wrapper">
      <NavBar></NavBar>
      <div class="search-and-filter-container" :class="{ 'search-active': isSearchActive }">

        <!-- These filters will be hidden on mobile when search is active -->
        <CategoryFilter :active-category="activeCategory" @category-changed="handleCategoryChange"
          class="category-filters" />


        <!-- NEW: The search icon button that is ONLY visible on mobile -->
        <button class="search-toggle-btn" @click="toggleSearch">
          <span class="material-icons">{{ isSearchActive ? 'close' : 'search' }}</span>
        </button>

        <!-- The actual search bar component -->
        <SearchBar @search-activated="activateSongSearch" @filtered-data="updatedSelection" :data-to-search="data"
          :check-partition="true" class="search-bar" />
      </div>

      <div v-if="activeCategory === 'Songs'" class="results-container">
        <ChoroLink class="result" v-for="(music, index) in filteredData" :id="index" :music="music" :key="music"
          @click="openSongModal(music)" />
      </div>

      <div v-if="activeCategory === 'Artists'" class="results-container">
        <div v-for="(author, index) in uniqueAuthors" :id="index" :key="author">
          <AuthorCard @click="openAuthorModal(author)" :author="author" :id="index" class='result' />
        </div>
      </div>
    </div>

    <div v-if="showSongModal" class="modal-overlay" @click.self="closeSongModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeSongModal" aria-label="Close">×</button>
        <ChoroCard :music="selectedSong" />
      </div>
    </div>

    <div v-if="showAuthorModal" class="modal-overlay" @click.self="closeAuthorModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeAuthorModal" aria-label="Close">×</button>

        <div v-if="selectedAuthor">
          <h2> {{ selectedAuthor }}</h2>
          <div class="modal-results-container">
            <ChoroLink v-for="(music, index) in songsBySelectedAuthor" :key="music.title" :music="music" :id="index"
              @click="openSongFromAuthorModal(music)" class="modal-result" />
          </div>
        </div>
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
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    ChoroLink,
    CategoryFilter,
    AuthorCard,
    ChoroCard,
    NavBar
  },

  data() {
    return {
      data: listeChoros.data.filter(itemSong => this.has_partition(itemSong)),
      filteredData: [],
      showFilters: false,
      activeCategory: 'Songs',
      showSongModal: false,      // <-- add this
      showAuthorModal: false,      // <-- add this
      selectedSong: null,         // <-- add this
      selectedAuthor: null,
      isSearchActive: false, // <-- NEW: State to control the search bar's visibility on mobile
    }
  },

  created() {
    this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
    this.uniqueAuthors = [...new Set(this.data.map(elt => elt.author))]
  },

  computed: {
    songsBySelectedAuthor() {
      if (!this.selectedAuthor) return [];
      return this.data
        .filter(song => song.author === this.selectedAuthor)
        .sort((a, b) => (a.title > b.title) ? 1 : -1);
    }
  },

  methods: {

    activateSongSearch() {
      this.activeCategory = 'Songs';
    },

    toggleSearch() {
      this.isSearchActive = !this.isSearchActive;
      this.activeCategory = 'Songs';
    },

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

    openAuthorModal(author) {
      this.selectedAuthor = author;
      this.showAuthorModal = true;
      console.log('Selected author:', author);
    },

    closeAuthorModal() {
      this.showAuthorModal = false;
      this.selectedAuthor = null;
    },

    openSongFromAuthorModal(song) {
      this.closeAuthorModal();
      this.openSongModal(song);
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
  padding: 0;
}

.content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-and-filter-container {
  display: flex;
  width: 90vw;
  margin-bottom: 1rem;
  padding: 0 1rem;
}



.search-and-filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  padding: 0 1rem;
}


@media (min-width: 769px) {
  .search-bar {
    flex-grow: 1;
  }
}


.results-container {
  overflow-y: auto;
  border-radius: 10px;
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

.category-filters {
  padding-bottom: 0.25rem;
}

.modal-results-container {
  height: 80vh;
  overflow-y: scroll;
}

.modal-result {
  margin-bottom: 5px;
  box-shadow: #00000069 1px 1px;
}




@media (max-width: 768px) {
  .search-and-filter-container {
    position: relative; // Needed to position children correctly
    align-items: center;
  }

  // The new search icon button
  .search-toggle-btn {
    display: flex; // This makes it visible on mobile
    background: #333;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 20px;
    cursor: pointer;
    // position: absolute; // Position it within the container
    // left: 1rem;
    z-index: 2; // Make sure it's on top
  }

  // By default on mobile, the category filters are visible
  .category-filters {
    flex-grow: 1;
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  // And the search bar itself is hidden
  .search-bar {
    // position: absolute;
    // left: 1rem;
    // right: 1rem;
    width: 0; // Starts with zero width
    opacity: 0;
    pointer-events: none; // Not clickable when hidden
    transition: width 0.3s ease, opacity 0.3s ease;
    z-index: 1;
    margin-left: 0; // Override desktop margin
  }

  /* --- STYLES FOR WHEN SEARCH IS ACTIVE --- */

  // When the container has the 'search-active' class...
  .search-and-filter-container.search-active {

    // Hide the category filters
    .category-filters {
      width: 0;
      opacity: 0;
      pointer-events: none;
    }

    // Expand the search bar to take up the full width
    .search-bar {
      width: calc(100% - 2rem); // Fill the container (minus padding)
      opacity: 1;
      pointer-events: auto;
    }
  }

}

@media (min-width: 769px) {

  // On desktop, make sure the toggle button is hidden
  .search-toggle-btn {
    display: none;
  }
}
</style>
