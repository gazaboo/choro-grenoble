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
 * Groups PDF paths by song. Filenames look like:
 *   "Zé Menezes - Encabulado - Theme - Clarinet Bb.pdf"
 * so the author and title are the first two " - " separated fields.
 */
function buildIndex(tree) {
  const songs = new Map()

  for (const file of tree) {
    if (!file.path.endsWith('.pdf')) continue

    const filename = file.path.split('/').pop().slice(0, -'.pdf'.length)
    const parts = filename.split(' - ')
    if (parts.length < 2) continue

    const author = parts[0].trim()
    const title = parts[1].trim()
    const key = `${author}||${title}`

    if (!songs.has(key)) songs.set(key, [author, title, []])
    songs.get(key)[2].push(file.path)
  }

  // Sort for a stable diff between regenerations.
  for (const song of songs.values()) song[2].sort()
  return [...songs.values()].sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))
}

const tree = await fetchTree()
const index = buildIndex(tree)

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(index))

const pdfCount = index.reduce((total, song) => total + song[2].length, 0)
console.log(`Wrote ${OUT}`)
console.log(`  ${index.length} songs, ${pdfCount} PDFs, ${(JSON.stringify(index).length / 1024).toFixed(0)} KiB raw`)
