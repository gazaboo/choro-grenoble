import { createStore } from 'vuex'
import listeChoros from "@/assets/liste_totale_choros.json";

export default createStore({
    state: {
        'data': listeChoros.data,
        'filteredData': listeChoros.data
    }
})