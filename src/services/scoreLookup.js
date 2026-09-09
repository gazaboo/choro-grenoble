/**
 * Resolves a song from the list to its MuseScore entry in liste_totale_choros.json.
 *
 * The two datasets were built at different times and disagree on capitalisation
 * and accents, so an exact string match loses 88 songs whose score does exist —
 * their "Muse Score" and "Music Sheet" buttons simply never appear. Comparing on
 * a folded form recovers them.
 */

import listeChoros from '@/assets/liste_totale_choros.json'

/** Lowercases and strips diacritics and punctuation, so "Doce De Côco" === "doce de coco". */
function fold(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

const byTitleAndAuthor = new Map()
const byTitle = new Map()
const composersPerTitle = new Map()

for (const entry of listeChoros.data) {
  const title = fold(entry.title)
  byTitleAndAuthor.set(`${title}||${fold(entry.author)}`, entry)
  if (!byTitle.has(title)) byTitle.set(title, entry)

  if (!composersPerTitle.has(title)) composersPerTitle.set(title, new Set())
  composersPerTitle.get(title).add(fold(entry.author))
}

/** Eight titles — "Passatempo", "Helena", "Perigoso"… — belong to two composers. */
function isAmbiguous(foldedTitle) {
  const composers = composersPerTitle.get(foldedTitle)
  return !!composers && composers.size > 1
}

/**
 * Finds the MuseScore entry for a song. Pass the author whenever it is known.
 *
 * Falling back to the title alone is what used to open Ernesto Nazareth's
 * "Perigoso" for Orlando Silveira's, so the fallback is refused on the titles
 * two composers share: showing no score button beats showing the wrong piece.
 * Credits that differ in wording rather than spelling — a PDF filed under
 * "Pixinguinha E Benedito Lacerda" whose score is filed under "Pixinguinha" —
 * still resolve, because their titles are unambiguous.
 */
export function findScore({ title, author }) {
  const foldedTitle = fold(title)

  if (author) {
    const match = byTitleAndAuthor.get(`${foldedTitle}||${fold(author)}`)
    if (match) return match
    if (isAmbiguous(foldedTitle)) return undefined
  }

  return byTitle.get(foldedTitle)
}
