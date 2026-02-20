<template>
  <Transition @enter="onEnter" :css="false">
    <section v-if="store.isArchiveVisible" class="archive-root">

      <!-- Шапка -->
      <header class="archive-header">
        <div class="archive-header-left">
          <p class="archive-label">архив</p>
          <h2 class="archive-title">zero day</h2>
        </div>
        <div class="archive-header-right">
          <p class="archive-count">{{ store.items.length }} записей</p>
        </div>
      </header>

      <div class="archive-divider" />

      <!-- Альбомы -->
      <div
        v-for="album in store.albums"
        :key="album.id"
        class="album-block"
      >
        <!-- Заголовок альбома -->
        <div class="album-heading">
          <span class="album-year">{{ album.year }}</span>
          <span class="album-name">{{ album.title }}</span>
          <span class="album-track-count">{{ album.tracks.length }} тр.</span>
        </div>

        <!-- Заголовки колонок — только ≥ 640px -->
        <div class="archive-cols-header">
          <span class="col-num">#</span>
          <span class="col-title">название</span>
          <span class="col-tags">формат</span>
          <span class="col-action" />
        </div>

        <!-- Треки альбома -->
        <ul class="archive-list">
          <li
            v-for="(track, i) in album.tracks"
            :key="track.id"
            class="archive-row"
            @click="store.openModal(toArchiveItem(album, track, i), globalIndex(album, i))"
          >
            <!-- Мобильная карточка -->
            <div class="row-mobile">
              <div class="row-mobile-top">
                <span class="row-num-mobile">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="row-arrow-mobile">→</span>
              </div>
              <span class="row-title-mobile">{{ track.title }}</span>
              <span class="row-excerpt-mobile">{{ track.lyrics?.split('\n')[0] }}</span>
              <div class="row-tags-mobile">
                <span v-if="track.audio" class="tag">аудио</span>
                <span v-if="track.lyrics" class="tag">текст</span>
              </div>
            </div>

            <!-- Десктопная строка -->
            <span class="col-num row-num desktop-only">{{ String(i + 1).padStart(2, '0') }}</span>

            <div class="col-title row-info desktop-only">
              <span class="row-title">{{ track.title }}</span>
              <span class="row-excerpt">{{ track.lyrics?.split('\n')[0] }}</span>
            </div>

            <div class="col-tags row-tags desktop-only">
              <span v-if="track.audio" class="tag">аудио</span>
              <span v-if="track.lyrics" class="tag">текст</span>
            </div>

            <div class="col-action row-action desktop-only">
              <span class="row-arrow">→</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="archive-divider" style="margin-top: auto;" />
      <footer class="archive-footer">
        <p class="footer-note">пространство памяти · все записи зафиксированы</p>
      </footer>

    </section>
  </Transition>
</template>

<script setup lang="ts">
import type { Album, Track, ArchiveItem } from '~/stores/archive'

const store = useArchiveStore()

function toArchiveItem(album: Album, track: Track, i: number): ArchiveItem {
  return {
    id: track.id,
    albumId: album.id,
    albumTitle: album.title,
    albumYear: album.year,
    index: i + 1,
    title: track.title,
    duration: track.duration,
    audio: track.audio,
    cover: track.cover || album.cover,
    lyrics: track.lyrics,
  }
}

// Глобальный индекс для навигации между треками
function globalIndex(album: Album, trackIndex: number): number {
  let offset = 0
  for (const a of store.albums) {
    if (a.id === album.id) break
    offset += a.tracks.length
  }
  return offset + trackIndex
}

function onEnter(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(30px)'
  requestAnimationFrame(() => {
    htmlEl.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
    htmlEl.style.opacity = '1'
    htmlEl.style.transform = 'translateY(0)'
    setTimeout(done, 700)
  })
}
</script>

<style scoped>
/* ── Корень ─────────────────────────────────────────────── */
.archive-root {
  min-height: 100svh;
  background: #000;
  display: flex;
  flex-direction: column;
  padding: 0 clamp(1.25rem, 5vw, 5rem);
}

/* ── Шапка ──────────────────────────────────────────────── */
.archive-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 4rem 0 1.75rem;
}

@media (min-width: 768px) {
  .archive-header {
    padding: 5rem 0 2rem;
  }
}

.archive-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.archive-label {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #333;
}

.archive-title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 6vw, 3.5rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  color: #fafafa;
  margin: 0;
}

.archive-count {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #333;
  align-self: flex-end;
}

/* ── Разделитель ─────────────────────────────────────────── */
.archive-divider {
  width: 100%;
  height: 1px;
  background: #1a1a1a;
}

/* ── Блок альбома ────────────────────────────────────────── */
.album-block {
  margin-top: 2.5rem;
}

.album-heading {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 1rem;
}

.album-year {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #2a2a2a;
}

.album-name {
  font-family: var(--font-serif);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 400;
  color: #444;
  letter-spacing: -0.02em;
}

.album-track-count {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #222;
  margin-left: auto;
}

/* ── Колонки-заголовки — только ≥ 640px ─────────────────── */
.archive-cols-header {
  display: none;
}

@media (min-width: 640px) {
  .archive-cols-header {
    display: grid;
    grid-template-columns: 3rem 1fr 8rem 2.5rem;
    padding: 0.75rem 0 0.5rem;
    column-gap: 1.5rem;
    border-top: 1px solid #111;
  }

  .archive-cols-header span {
    font-family: var(--font-sans);
    font-size: 0.55rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #2a2a2a;
  }
}

/* ── Список ─────────────────────────────────────────────── */
.archive-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ── Строка ─────────────────────────────────────────────── */
.archive-row {
  cursor: pointer;
  border-bottom: 1px solid #111;
  position: relative;
  transition: background 0.2s ease;
}

.archive-row::before {
  content: '';
  position: absolute;
  inset: 0 -1.25rem;
  background: #0d0d0d;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.archive-row:hover::before,
.archive-row:active::before {
  opacity: 1;
}

.archive-row > * {
  position: relative;
  z-index: 1;
}

/* ── МОБИЛЬНАЯ карточка (< 640px) ────────────────────────── */
.row-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.4rem 0;
}

@media (min-width: 640px) {
  .row-mobile { display: none; }
}

.row-mobile-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-num-mobile {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: #2a2a2a;
  transition: color 0.2s ease;
}

.archive-row:active .row-num-mobile { color: #555; }

.row-arrow-mobile {
  font-size: 0.85rem;
  color: #2a2a2a;
  transition: color 0.2s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.archive-row:active .row-arrow-mobile {
  color: #888;
  transform: translateX(4px);
}

.row-title-mobile {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 400;
  color: #d0d0d0;
  line-height: 1.2;
  transition: color 0.2s ease;
}

.archive-row:active .row-title-mobile { color: #fafafa; }

.row-excerpt-mobile {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  line-height: 1.6;
  color: #2e2e2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-tags-mobile {
  display: flex;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

/* ── ДЕСКТОП строка (≥ 640px) ────────────────────────────── */
.desktop-only {
  display: none;
}

@media (min-width: 640px) {
  .archive-row {
    display: grid;
    grid-template-columns: 3rem 1fr 8rem 2.5rem;
    column-gap: 1.5rem;
    align-items: center;
    padding: 1.6rem 0;
  }

  .desktop-only {
    display: flex;
  }

  .col-num { justify-content: flex-start; }
  .col-action { justify-content: flex-end; }
}

/* ── Колонка: номер ─────────────────────────────────────── */
.row-num {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #2a2a2a;
  transition: color 0.2s ease;
}

.archive-row:hover .row-num { color: #555; }

/* ── Колонка: название + excerpt ────────────────────────── */
.row-info {
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.row-title {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  font-weight: 400;
  color: #c8c8c8;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-row:hover .row-title { color: #fafafa; }

.row-excerpt {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  line-height: 1.5;
  color: #2e2e2e;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-row:hover .row-excerpt { color: #555; }

/* ── Теги ───────────────────────────────────────────────── */
.row-tags {
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #2a2a2a;
  border: 1px solid #1a1a1a;
  padding: 0.25rem 0.55rem;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.archive-row:hover .tag,
.archive-row:active .tag {
  color: #444;
  border-color: #2a2a2a;
}

/* ── Стрелка ────────────────────────────────────────────── */
.row-action {
  justify-content: flex-end;
}

.row-arrow {
  font-size: 0.85rem;
  color: #1e1e1e;
  transition: color 0.2s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}

.archive-row:hover .row-arrow {
  color: #888;
  transform: translateX(4px);
}

/* ── Футер ──────────────────────────────────────────────── */
.archive-footer {
  padding: 1.5rem 0 max(2rem, env(safe-area-inset-bottom, 2rem));
}

.footer-note {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1e1e1e;
}
</style>
