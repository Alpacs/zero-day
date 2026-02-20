<template>
  <Teleport to="body">
    <Transition @enter="onModalEnter" @leave="onModalLeave" :css="false">
      <div
        v-if="store.isModalOpen"
        class="modal-overlay"
        @click.self="store.closeModal()"
      >
        <div class="modal-container">

          <!-- ── Мобиль: обложка сверху ────────────────────── -->
          <div class="modal-cover">
            <img
              v-if="store.activeItem"
              :src="store.activeItem.cover"
              :alt="store.activeItem.title"
              class="modal-cover-img"
            />
            <div class="modal-cover-vignette" />

            <!-- Номер поверх обложки -->
            <span class="modal-cover-index">
              {{ String(store.activeIndex + 1).padStart(2, '0') }}
            </span>

            <!-- Кнопка закрыть -->
            <button class="modal-close" @click="store.closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- ── Панель контента ─────────────────────────────── -->
          <div class="modal-panel">

            <!-- Заголовок -->
            <div class="modal-heading">
              <h3 class="modal-track-title">{{ store.activeItem?.title }}</h3>
              <p class="modal-track-meta">аудио · текст · образ</p>
            </div>

            <!-- Плеер -->
            <div class="modal-player">
              <button class="play-btn" @click="handlePlayToggle">
                <svg v-if="!store.isPlaying" viewBox="0 0 18 20" style="width:14px;height:16px;fill:currentColor;margin-left:2px;">
                  <path d="M17 10L1 19V1L17 10Z"/>
                </svg>
                <svg v-else viewBox="0 0 18 20" style="width:14px;height:16px;fill:currentColor;">
                  <rect x="3" y="2" width="5" height="16"/>
                  <rect x="10" y="2" width="5" height="16"/>
                </svg>
              </button>

              <div class="player-track">
                <div class="progress-bar" @click="onBarClick">
                  <div class="progress-fill" :style="{ width: store.progress + '%' }" />
                </div>
                <div class="player-times">
                  <span>{{ store.currentTimeFormatted }}</span>
                  <span>{{ store.totalTimeFormatted }}</span>
                </div>
              </div>
            </div>

            <!-- Разделитель -->
            <div class="modal-divider" />

            <!-- Текст -->
              <div class="modal-body-text">{{ store.activeItem?.lyrics }}</div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const store = useArchiveStore()



watch(() => store.isModalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function handlePlayToggle() { store.togglePlay() }

function onBarClick(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const pct = ((e.clientX - rect.left) / rect.width) * 100
  store.setProgress(Math.max(0, Math.min(100, pct)))
}

function onModalEnter(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  const container = htmlEl.querySelector('.modal-container') as HTMLElement
  if (container) {
    container.style.transform = 'translateY(40px)'
    container.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
  }
  htmlEl.style.transition = 'opacity 0.4s ease'
  requestAnimationFrame(() => {
    htmlEl.style.opacity = '1'
    if (container) container.style.transform = 'translateY(0)'
    setTimeout(done, 600)
  })
}

function onModalLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  const container = htmlEl.querySelector('.modal-container') as HTMLElement
  htmlEl.style.transition = 'opacity 0.35s ease'
  if (container) {
    container.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
    container.style.transform = 'translateY(30px)'
  }
  htmlEl.style.opacity = '0'
  setTimeout(done, 400)
}

onUnmounted(() => {
  document.body.style.overflow = ''
})

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && store.isModalOpen) store.closeModal()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
/* ── Оверлей ─────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: flex-end;       /* мобиль: снизу */
  justify-content: center;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    background: rgba(0,0,0,0.85);
  }
}

/* ── Контейнер ───────────────────────────────────────────── */
.modal-container {
  width: 100%;
  height: 94svh;
  max-height: 94svh;
  background: #000;
  border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Мобиль: sheet снизу с скруглением вверху */
  border-radius: 16px 16px 0 0;
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 1100px;
    height: 88svh;
    max-height: 88svh;
    border-radius: 2px;
    border: 1px solid #1a1a1a;
    /* Десктоп: сетка */
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Обложка ─────────────────────────────────────────────── */
.modal-cover {
  position: relative;
  height: 42vw;
  max-height: 280px;
  flex-shrink: 0;
  overflow: hidden;
}

@media (min-width: 768px) {
  .modal-cover {
    height: auto;
    max-height: none;
  }
}

.modal-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.modal-cover-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 25%, transparent 60%),
    linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%);
  pointer-events: none;
}

@media (min-width: 768px) {
  .modal-cover-vignette {
    background:
      linear-gradient(to right, transparent 60%, rgba(0,0,0,0.6) 100%),
      linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 30%),
      linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 25%);
  }
}

.modal-cover-index {
  position: absolute;
  bottom: 1rem;
  left: 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #444;
}

@media (min-width: 768px) {
  .modal-cover-index {
    bottom: 1.5rem;
    left: 1.75rem;
  }
}

/* ── Кнопка закрыть ──────────────────────────────────────── */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  border: 1px solid #222;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease, border-color 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-close:hover,
.modal-close:active {
  color: #fafafa;
  border-color: #444;
}

.modal-close svg {
  width: 14px;
  height: 14px;
}

@media (min-width: 768px) {
  .modal-close {
    top: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
  }
}

/* ── Панель ──────────────────────────────────────────────── */
.modal-panel {
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem 1.5rem max(1.75rem, env(safe-area-inset-bottom, 1.75rem));
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
  .modal-panel {
    padding: 2.5rem 2.5rem 2.5rem 3rem;
    gap: 2rem;
    overflow-y: auto;
  }
}

/* ── Заголовок ───────────────────────────────────────────── */
.modal-heading {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.modal-track-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 400;
  line-height: 1.15;
  color: #fafafa;
  margin: 0;
  letter-spacing: -0.02em;
}

.modal-track-meta {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #333;
}

/* ── Плеер ───────────────────────────────────────────────── */
.modal-player {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.play-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fafafa;
  border: none;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease;
}

.play-btn:hover,
.play-btn:active {
  transform: scale(1.08);
  background: #fff;
}

@media (min-width: 768px) {
  .play-btn {
    width: 56px;
    height: 56px;
  }
}

.player-track {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 2px;
  background: #1f1f1f;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fafafa;
  transition: width 0.2s linear;
}

.player-times {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  color: #333;
  font-variant-numeric: tabular-nums;
}

/* ── Разделитель ─────────────────────────────────────────── */
.modal-divider {
  height: 1px;
  background: #111;
}

/* ── Текст ───────────────────────────────────────────────── */
.modal-body-text {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: 0.9rem;
  line-height: 2;
  color: #666;
  white-space: pre-line;
}

@media (min-width: 768px) {
  .modal-body-text {
    font-size: 1rem;
    line-height: 2.1;
  }
}

.modal-body-text::first-letter {
  font-size: 2.2rem;
  float: left;
  line-height: 0.75;
  margin-right: 0.45rem;
  margin-top: -0.1rem;
  color: #fafafa;
}
</style>
