import { createStore } from 'vuex'

/**
 * Empty for now, on purpose.
 *
 * This used to hold liste_totale_choros.json, which pulled 226 KB of JSON into
 * the entry chunk on every page load — including the home page, which needs
 * none of it. Nothing read that state any more: the song list is served from
 * public/choro-index.json (see services/choroLibrary.js), and the views that
 * still need the MuseScore links import the JSON directly, inside their own
 * lazily-loaded chunks.
 *
 * The store is kept registered so shared state has somewhere to go. Deciding
 * whether it earns its place — and merging the two song datasets behind it —
 * is still open.
 */
export default createStore({
    state: {}
})
