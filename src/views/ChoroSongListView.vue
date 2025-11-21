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

      <div v-if="activeCategory === 'Songs'" class="results-container">
        <ChoroLink class="result" v-for="(music, index) in filteredData" :id="index" :music="music" :key="music"
          @click="openSongModal(music)" />
      </div>
      <div v-else-if="activeCategory === 'Artists'" class="results-container">
        <div v-for="(author, index) in uniqueAuthors" :id="index" :key="author">
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
// import listeChoros from "@/assets/liste_totale_choros.json";
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
      data: [],
      filteredData: [],
      showFilters: false,
      activeCategory: 'Songs',
      showSongModal: false,
      showAuthorModal: false,
      selectedSong: null,
      selectedAuthor: null,
      isSearchActive: false,
    }
  },


  // async created() {
  //   this.data = await this.fetchPDFListFromGitHub();
  //   this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
  //   this.uniqueAuthors = [...new Set(this.data.map(elt => elt.author))]
  // },

  created() {
    this.initializeData();
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

    // 1. FETCH: Get raw list of PDF files from GitHub
    async fetchPDFListFromGitHub() {
      const owner = 'gazaboo';
      const repo = 'choro-db';
      const branch = 'main';
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.tree.filter(file => file.path.endsWith('.pdf'));
      } catch (error) {
        console.error("Failed to fetch from GitHub:", error);
        return [];
      }
    },

    // 2. Parse and Group Files
    processGithubFiles(files) {
      const songsMap = {};
      const owner = 'gazaboo';
      const repo = 'choro-db';
      const branch = 'main';
      const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

      files.forEach(file => {
        // Filename example: "Zé Menezes - Encabulado - Theme - Clarinet Bb.pdf"
        // Note: file.path includes the folder, e.g., "pdf/Zé Menezes..."
        const fullFilename = file.path.split('/').pop().replace('.pdf', '');
        const parts = fullFilename.split(' - ');

        // Safety check: Ensure we have enough parts
        if (parts.length < 2) return;

        const author = parts[0].trim();
        const title = parts[1].trim();

        // Default Key logic
        // We look for key indicators in the filename (last part usually)
        let key = 'C';
        if (fullFilename.includes('Clarinet Bb')) key = 'Bb';
        else if (fullFilename.includes('Saxophone Eb')) key = 'Eb';
        else if (fullFilename.includes(' - C')) key = 'C';
        // Handle variants if needed (e.g. " - C - variant 1") -> Key is still C

        // Determine Type
        const isContracanto = fullFilename.toLowerCase().includes('contraponto');

        const uniqueKey = `${author}||${title}`;

        // Initialize song entry if new
        if (!songsMap[uniqueKey]) {
          songsMap[uniqueKey] = {
            title: title,
            author: author,
            melody: {},
            contracanto: {},
            pdfs: []
          };
        }

        // Construct raw URL (handle spaces in filename)
        const pdfUrl = `${baseUrl}${encodeURIComponent(file.path)}`;

        // Add to melody or contracanto map for specific instrument keys
        // Note: If multiple variants exist for same key, this simple map will take the last one.
        // If you need all variants accessible, rely on the 'pdfs' array below.
        if (isContracanto) {
          songsMap[uniqueKey].contracanto[key] = pdfUrl;
        } else {
          songsMap[uniqueKey].melody[key] = pdfUrl;
        }

        // Add to full list of PDFs for this song (good for "All Versions" list in modal)
        songsMap[uniqueKey].pdfs.push({
          url: pdfUrl,
          filename: fullFilename,
          key: key,
          type: isContracanto ? 'Contracanto' : 'Theme'
        });
      });

      return Object.values(songsMap);
    },

    async initializeData() {
      const pdfFiles = await this.fetchPDFListFromGitHub();
      this.data = this.processGithubFiles(pdfFiles);

      this.filteredData = this.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
      this.uniqueAuthors = [...new Set(this.data.map(elt => elt.author))].sort();
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
