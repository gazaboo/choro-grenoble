#!/usr/bin/env node
/**
 * Generates public/choro-index.json from the choro-db repository.
 *
 * The app used to call the GitHub tree API at runtime on every visit to
 * /choro: ~2 MB of JSON, of which only the PDF paths were used, and capped
 * at 60 requests/hour/IP for unauthenticated callers. This script does that
 * call once, offline, and stores only what the app reads.
 *
 * Run it whenever choro-db gains or loses scores, then commit the result:
 *   npm run build:index
 *
 * Set GITHUB_TOKEN to raise the API rate limit if you hit it.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OWNER = 'gazaboo'
const REPO = 'choro-db'
const BRANCH = 'main'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/choro-index.json')

async function fetchTree() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} ${response.statusText}`)
  }

  const body = await response.json()
  if (body.truncated) {
    throw new Error('GitHub truncated the tree response; the repo outgrew a single API call.')
  }
  return body.tree
}

/**
 * Composers filed in choro-db under two spellings, which splits them into two
 * entries in the song list. Every line here was reviewed and signed off by hand.
 *
 * This only changes the name the index reports. Songs stay keyed on the original
 * author, so two spellings still produce two song entries — merging those is a
 * separate decision that has not been taken. The files in choro-db keep their
 * names either way, so any line here is reversible by deleting it.
 *
 * `Canhoto` (Américo Jacomino) is deliberately absent: he is NOT `Canhoto da
 * Paraíba` (Francisco Soares de Araújo). Two musicians, two entries.
 */
const AUTHOR_RENAMES = new Map([
  // Portuguese particles are lowercase inside a name.
  ['Anacleto De Medeiros', 'Anacleto de Medeiros'],
  ['Avena De Castro', 'Avena de Castro'],
  ['Canhoto Da Paraíba', 'Canhoto da Paraíba'],
  ['Guio De Morais', 'Guio de Morais'],
  ['Henrique Alves De Mesquita', 'Henrique Alves de Mesquita'],
  ['Irineu De Almeida', 'Irineu de Almeida'],
  ['Jacob Do Bandolim', 'Jacob do Bandolim'],
  ['João Dos Santos', 'João dos Santos'],
  ['Joubert De Carvalho', 'Joubert de Carvalho'],
  ['Paulinho Da Viola', 'Paulinho da Viola'],
  ['Rildo hora', 'Rildo Hora'],
  ['Zequinha De Abreu', 'Zequinha de Abreu'],

  // Missing accents.
  ['Cristovão Bastos', 'Cristóvão Bastos'],
  ['Indio Do Cavaquinho', 'Índio do Cavaquinho'],
  ['Laercio De Freitas', 'Laércio de Freitas'],
  ['Luiz Otavio Braga', 'Luiz Otávio Braga'],
  ['Patapio Silva', 'Patápio Silva'],

  // Hyphenation. `Guerra-Peixe` takes the hyphen even though the unhyphenated
  // spelling carries more files; `Tico Tico` goes the other way.
  ['Guerra Peixe', 'Guerra-Peixe'],
  ['K Ximbinho', 'K-Ximbinho'],
  ['Tico-Tico', 'Tico Tico'],

  // Neither spelling in the repository is right, so both map onto a third form.
  ['Hamilton De Holanda', 'Hamilton de Holanda'],
  ['Hamílton de Holanda', 'Hamilton de Holanda']
])

/**
 * Misspelt titles, each folded into the entry it belongs to. Unlike the author
 * renames above these DO merge two song entries into one, because that is what
 * repairing a typo means.
 *
 * Keys and values are both the raw "author||title" as they appear in choro-db.
 * Reviewed and signed off individually; pairs whose status was uncertain
 * (Elena/Helena, Lamento/Lamentos, Meditando C/F, Gadu namorando) are absent on
 * purpose, as is Glória/Na Glória, confirmed as two distinct pieces.
 */
const SONG_MERGES = new Map([
  ['Abel Ferreira||Acariaciando', ['Abel Ferreira', 'Acariciando']],
  ['Astor Silva||Chorinho Na Gaifieira', ['Astor Silva', 'Chorinho de gafieira']],
  ['Eduardo Souto||Party Dançante', ['Eduardo Souto', 'Parati dançante']],
  ['Henrique Alves De Mesquita||Baruque', ['Henrique Alves de Mesquita', 'Batuque']],
  ['K-Ximbinho||Tenura', ['K Ximbinho', 'Ternura']],
  ['Pixinguinha E Benedito Lacerda||Sofre Porque Queres', ['Pixinguinha E Benedito Lacerda', 'Sofres Porque Queres']],
  ['Pixinguinha E Benedito Lacerda||Urubatan', ['Pixinguinha E Benedito Lacerda', 'Urubatã']],
  ['Tico-Tico||A Moçada Na Samba', ['Tico Tico', 'A moçada no samba']]
])

/**
 * Groups PDF paths by song. Filenames look like:
 *   "Zé Menezes - Encabulado - Theme - Clarinet Bb.pdf"
 * so the author and title are the first two " - " separated fields.
 *
 * Songs are still keyed on the *original* author, so two spellings of one name
 * stay two entries even after renaming. Merging them is a separate decision.
 */
function buildIndex(tree) {
  const songs = new Map()

  for (const file of tree) {
    if (!file.path.endsWith('.pdf')) continue

    const filename = file.path.split('/').pop().slice(0, -'.pdf'.length)
    const parts = filename.split(' - ')
    if (parts.length < 2) continue

    const rawAuthor = parts[0].trim()
    const rawTitle = parts[1].trim()
    const [author, title] = SONG_MERGES.get(`${rawAuthor}||${rawTitle}`) ?? [rawAuthor, rawTitle]
    const key = `${author}||${title}`

    if (!songs.has(key)) {
      songs.set(key, [AUTHOR_RENAMES.get(author) ?? author, title, [], new Set()])
    }
    const song = songs.get(key)

    // 1839 of the 1856 "- variant 1" files are byte-identical to the file they
    // sit next to, which is why a song's modal shows six PDF buttons where three
    // are the same document. Git's blob sha tells them apart for free; only the
    // 17 genuinely different variants survive this.
    if (song[3].has(file.sha)) continue
    song[3].add(file.sha)
    song[2].push(file.path)
  }

  // Sort for a stable diff between regenerations, and drop the sha bookkeeping.
  const rows = [...songs.values()].map(([author, title, paths]) => [author, title, paths.sort()])
  return rows.sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))
}

const tree = await fetchTree()
const index = buildIndex(tree)

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(index))

const pdfCount = index.reduce((total, song) => total + song[2].length, 0)
console.log(`Wrote ${OUT}`)
console.log(`  ${index.length} songs, ${pdfCount} PDFs, ${(JSON.stringify(index).length / 1024).toFixed(0)} KiB raw`)
