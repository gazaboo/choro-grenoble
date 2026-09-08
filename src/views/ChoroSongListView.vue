<template>

  <div class="choro-song-list-container">
    <div class="content-wrapper">

      <NavBar></NavBar>

      <div class="search-and-filter-container" :class="{ 'search-active': isSearchActive }">
        <CategoryFilter :active-category="activeCategory" @category-changed="handleCategoryChange"
          class="category-filters" />
        <button class="search-toggle-btn" @click="toggleSearch">
          <span class="material-icons">{{ isSearchActive ? 'close' : 'search' }}</span>
        </button>
        <SearchBar @search-activated="activateSongSearch" @filtered-data="updatedSelection" :data-to-search="data"
          :check-partition="true" class="search-bar" />
      </div>

      <p v-if="loadError" class="load-error">{{ loadError }}</p>

      <div v-else-if="activeCategory === 'Songs'" ref="results" class="results-container" @scroll.passive="onResultsScroll">
        <ChoroLink class="result" v-for="(music, index) in visibleSongs" :id="index" :music="music"
          :key="songKey(music)" @click="openSongModal(music)" />
      </div>
      <div v-else-if="activeCategory === 'Artists'" ref="results" class="results-container" @scroll.passive="onResultsScroll">
        <div v-for="(author, index) in visibleAuthors" :key="author">
          <AuthorCard @click="openAuthorModal(author)" :author="author" :id="index" class='result' />
        </div>
      </div>
    </div>

    <Transition name="transition-fade-modals">
      <div v-if="showSongModal" class="modal-overlay" @click.self="closeSongModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeSongModal" aria-label="Close">×</button>
          <ChoroCard :music="selectedSong" />
        </div>
      </div>
    </Transition>

    <Transition name="transition-fade-modals">
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
    </Transition>

  </div>

</template>


<script>

// @ is an alias to /src

import SearchBar from '@/components/SearchBar.vue';
import ChoroLink from '@/components/ChoroLink.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import AuthorCard from '@/components/AuthorCard.vue'
import ChoroCard from '@/components/ChoroCard.vue';
import NavBar from '@/components/NavBar.vue';
import { loadChoroLibrary } from '@/services/choroLibrary';

// Mounting all 1141 rows at once costs ~366 ms on a mid-range phone, and that
// bill is paid again every time the filter changes. Rows are cheap to scroll
// once they exist (measured: no dropped frames), so rather than windowing them
// — which the variable row height makes unreliable — we render enough to fill
// the viewport straight away and append the rest while the browser is idle.
const INITIAL_ROWS = 40
const GROW_CHUNK = 150
// Grow immediately, ignoring the idle queue, when the user scrolls this close
// to the end of what has been rendered so far.
const SCROLL_GROW_MARGIN_PX = 1200

const requestIdle = window.requestIdleCallback || (cb => setTimeout(() => cb(), 16))
const cancelIdle = window.cancelIdleCallback || clearTimeout

export default {

  name: 'ChoroSongListView',

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
      data: [],
      filteredData: [],
      uniqueAuthors: [],
      loadError: '',
      showFilters: false,
      activeCategory: 'Songs',
      showSongModal: false,
      showAuthorModal: false,
      selectedSong: null,
      selectedAuthor: null,
      isSearchActive: false,
      renderLimit: INITIAL_ROWS,
      growHandle: null,
    }
  },


  created() {
    this.initializeData();
  },


  unmounted() {
    cancelIdle(this.growHandle);
  },


  computed: {
    songsBySelectedAuthor() {
      if (!this.selectedAuthor) return [];
      return this.data
        .filter(song => song.author === this.selectedAuthor)
        .sort((a, b) => (a.title > b.title) ? 1 : -1);
    },

    activeList() {
      return this.activeCategory === 'Artists' ? this.uniqueAuthors : this.filteredData;
    },

    visibleSongs() {
      return this.filteredData.slice(0, this.renderLimit);
    },

    visibleAuthors() {
      return this.uniqueAuthors.slice(0, this.renderLimit);
    },
  },


  watch: {
    // Any change of list starts the progressive fill over.
    activeList() {
      this.restartGrowing();
    },
  },


  methods: {

    async initializeData() {
      try {
        this.data = await loadChoroLibrary();
      } catch (error) {
        console.error('Failed to load the song library:', error);
        this.loadError = 'Could not load the song list. Please check your connection and reload.';
        return;
      }

      this.filteredData = this.data.slice().sort((a, b) => (a.title > b.title) ? 1 : -1);
      this.uniqueAuthors = [...new Set(this.data.map(elt => elt.author))].sort();
    },

    songKey(music) {
      return `${music.author}||${music.title}`;
    },

    restartGrowing() {
      cancelIdle(this.growHandle);
      this.renderLimit = INITIAL_ROWS;
      this.growUntilComplete();
    },

    growUntilComplete() {
      cancelIdle(this.growHandle);
      if (this.renderLimit >= this.activeList.length) return;
      this.growHandle = requestIdle(() => {
        this.renderLimit = Math.min(this.renderLimit + GROW_CHUNK, this.activeList.length);
        this.growUntilComplete();
      });
    },

    // Idle time may never come while the user is actively scrolling, so keep
    // the rendered window ahead of them.
    onResultsScroll(event) {
      const el = event.target;
      if (this.renderLimit >= this.activeList.length) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight > SCROLL_GROW_MARGIN_PX) return;
      this.renderLimit = Math.min(this.renderLimit + GROW_CHUNK, this.activeList.length);
      this.growUntilComplete();
    },

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

    backToTop() {
      // Jump the results list back to the top after the DOM has settled.
      // This runs on every search update, so it must not animate.
      this.$nextTick(() => {
        if (this.$refs.results) this.$refs.results.scrollTop = 0;
      });
    },

    handleCategoryChange(category) {
      this.activeCategory = category;
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

.load-error {
  padding: 2rem 1rem;
  text-align: center;
  color: #ff8a80;
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

// Mobile
@media (max-width: 768px) {
  .search-and-filter-container {
    position: relative;
    align-items: center;
  }


  .search-toggle-btn {
    display: flex;
    background: #333;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 20px;
    cursor: pointer;
    z-index: 2;
  }

  .category-filters {
    flex-grow: 1;
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  .search-bar {
    width: 0;
    opacity: 0;
    pointer-events: none;
    transition: width 0.3s ease, opacity 0.3s ease;
    z-index: 1;
    margin-left: 0;
  }


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

// desktop, make sure the toggle button is hidden
@media (min-width: 769px) {
  .search-toggle-btn {
    display: none;
  }
}




.transition-fade-modals-enter-active,
.transition-fade-modals-leave-active {
  transition: all 0.25s ease-out;
}

.transition-fade-modals-enter-from {
  opacity: 0;
}

.transition-fade-modals-enter-to {
  opacity: 1;
}

.transition-fade-modals-leave-from {
  opacity: 1;
}

.transition-fade-modals-leave-to {
  opacity: 0;
}
</style>
