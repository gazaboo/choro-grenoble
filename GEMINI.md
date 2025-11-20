# Project: Choro Grenoble

## Project Overview

This project is a web application designed for musicians to browse, search, and practice "choro" and "samba" music. It provides a digital songbook with features for viewing sheet music, transposing, and filtering songs and artists.

The application is built using Vue.js 3, with Vue Router for navigation and Vuex for state management. It uses `opensheetmusicdisplay` to render MusicXML files for sheet music display and `fuse.js` for fuzzy search functionality. The song data is stored in JSON files within the `src/assets` directory, and the sheet music itself is fetched from a separate GitHub repository.

## Building and Running

### Prerequisites

-   Node.js and npm

### Installation

```bash
npm install
```

### Development Server

To run the application in development mode with hot-reloading:

```bash
npm run serve
```

### Production Build

To compile and minify the application for production:

```bash
npm run build
```

### Linting

To lint and fix files:

```bash
npm run lint
```

## Development Conventions

-   **Component-Based Architecture:** The application follows a component-based architecture, with reusable UI components located in `src/components`.
-   **Styling:** SCSS is used for styling, with global styles defined in `src/styles/global.scss`.
-   **Data Management:** Song data is managed through JSON files (`liste_totale_choros.json`, `grillesSambas.json`, etc.) located in the `src/assets` directory.
-   **Sheet Music:** Sheet music is stored in the MusicXML format (`.mxl`) and fetched from the [gazaboo/choro-db](https://github.com/gazaboo/choro-db) GitHub repository.
-   **Routing:** The application uses Vue Router for client-side routing. Route definitions are in `src/router/index.js`.
-   **State Management:** Vuex is used for state management, with the store configured in `src/store/index.js`.
