<template>
  <Transition @leave="onLeave" :css="false">
    <section
      v-if="!store.isArchiveVisible"
      class="landing-root"
    >
      <!-- Фото — всегда фул-экран фон -->
      <div class="landing-photo-wrap">
        <img :src="imgSrc" alt="" class="landing-photo" />
        <!-- Мобиль: градиент снизу -->
        <div class="photo-vignette-mobile" />
        <!-- Десктоп: градиент слева -->
        <div class="photo-vignette-desktop" />
      </div>

      <!-- Контент -->
      <div class="landing-content">
        <div class="landing-inner">
          <p class="label-top">пространство памяти</p>
          <h1 class="heading-main">zero day</h1>
          <p class="body-text">
            здесь время не движется вперёд.<br>
            голоса, тексты и образы<br>
            существуют вне хронологии.
          </p>
          <button class="enter-btn" @click="store.enterArchive()">
            открыть архив
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
const store = useArchiveStore()
const imgSrc = '/images/zero.png'

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
})

function onLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(-40px)'
  unlockScroll()
  setTimeout(done, 800)
}

function unlockScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

onUnmounted(() => {
  unlockScroll()
})
</script>

<style scoped>
/* ── Корень ─────────────────────────────────────────────── */
.landing-root {
  position: relative;
  width: 100%;
  height: 100svh;
  background: #000;
  overflow: hidden;
}

/* ── Фото ───────────────────────────────────────────────── */
.landing-photo-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.landing-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* На мобиле — показываем верхнюю часть (лицо/торс) */
  object-position: center top;
  display: block;
}

/* Виньетка мобиль: снизу вверх и сверху чуть, боков нет */
.photo-vignette-mobile {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, #000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 60%, transparent 85%),
    linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.3) 8%, transparent 22%);
  pointer-events: none;
}

/* Виньетка десктоп: слева — скрыта на мобиле */
.photo-vignette-desktop {
  display: none;
  position: absolute;
  inset: 0;
  pointer-events: none;
}

@media (min-width: 768px) {
  .photo-vignette-mobile { display: none; }
  .photo-vignette-desktop {
    display: block;
    background:
      linear-gradient(to right, #000 0%, rgba(0,0,0,0.8) 22%, rgba(0,0,0,0.3) 42%, transparent 62%),
      linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 8%, transparent 22%),
      linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.15) 6%, transparent 18%);
  }

  /* Десктоп: фото справа, не на весь экран */
  .landing-photo {
    object-position: center center;
    width: 60%;
    margin-left: auto;
    height: 100%;
  }
}

@media (min-width: 1200px) {
  .landing-photo {
    width: 58%;
  }
}

/* ── Контент ─────────────────────────────────────────────── */
.landing-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  /* Мобиль: контент внизу */
  align-items: flex-end;
  padding: 0 0 env(safe-area-inset-bottom, 0);
}

@media (min-width: 768px) {
  .landing-content {
    align-items: center;
  }
}

.landing-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Мобиль: полная ширина, паддинг со всех сторон */
  padding: 2rem 1.75rem 3rem;
}

@media (min-width: 768px) {
  .landing-inner {
    width: 50%;
    max-width: 480px;
    padding: 0 3rem 0 4rem;
  }
}

@media (min-width: 1200px) {
  .landing-inner {
    padding: 0 4rem 0 6rem;
  }
}

/* ── Метка ──────────────────────────────────────────────── */
.label-top {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .label-top {
    color: #333;
    margin-bottom: 1.75rem;
  }
}

/* ── Заголовок ──────────────────────────────────────────── */
.heading-main {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 14vw, 5.5rem);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.9;
  color: #fafafa;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .heading-main {
    font-size: clamp(3rem, 6vw, 5.5rem);
    margin-bottom: 2.25rem;
  }
}

/* ── Текст ──────────────────────────────────────────────── */
.body-text {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: 0.9rem;
  line-height: 2;
  color: #888;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .body-text {
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    line-height: 2.1;
    color: #666;
    margin-bottom: 2.75rem;
  }
}

/* ── Кнопка ─────────────────────────────────────────────── */
.enter-btn {
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
  padding: 1.1rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: lowercase;
  text-align: center;
  color: #fafafa;
  background: rgba(255,255,255,0.04);
  border: 1px solid #2a2a2a;
  cursor: pointer;
  transition: color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 768px) {
  .enter-btn {
    width: fit-content;
    padding: 1rem 2.5rem;
    text-align: left;
    background: transparent;
    margin-bottom: 3.5rem;
  }
}

.enter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #fafafa;
  transform: translateX(-101%);
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.enter-btn:hover::before,
.enter-btn:active::before {
  transform: translateX(0);
}

.enter-btn:hover,
.enter-btn:active {
  color: #000;
  border-color: #fafafa;
}

.enter-btn span,
.enter-btn {
  position: relative;
  z-index: 1;
}
</style>
