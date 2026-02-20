import archiveData from '~/data/archive.json'

export interface Track {
  id: string
  title: string
  duration: number   // секунды
  audio: string      // путь к файлу, напр. /audio/track-01.mp3
  cover: string      // путь к обложке трека (если отличается от альбомной)
  lyrics: string
}

export interface Album {
  id: string
  title: string
  year: number
  description: string
  cover: string
  tracks: Track[]
}

// Плоский элемент для совместимости с текущим UI архива
export interface ArchiveItem {
  id: string
  albumId: string
  albumTitle: string
  albumYear: number
  index: number       // порядковый номер в альбоме
  title: string
  duration: number
  audio: string
  cover: string       // обложка трека или альбома
  lyrics: string
}

export const useArchiveStore = defineStore('archive', () => {
  // Исходные данные из JSON
  const albums: Album[] = archiveData as Album[]

  // Плоский список для рендера архива
  const items: ArchiveItem[] = albums.flatMap((album) =>
    album.tracks.map((track, i) => ({
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
    }))
  )

  // Modal state
  const isModalOpen = ref(false)
  const activeItem = ref<ArchiveItem | null>(null)
  const activeIndex = ref(0)

  // View state
  const isArchiveVisible = ref(false)

  // Player state — реальный Audio
  const isPlaying = ref(false)
  const progress = ref(0)
  const currentTime = ref(0)
  const audioDuration = ref(0)
  let audioEl: HTMLAudioElement | null = null

  function _destroyAudio() {
    if (!audioEl) return
    audioEl.pause()
    audioEl.src = ''
    audioEl.removeEventListener('timeupdate', _onTimeUpdate)
    audioEl.removeEventListener('ended', _onEnded)
    audioEl.removeEventListener('loadedmetadata', _onMeta)
    audioEl = null
    isPlaying.value = false
    progress.value = 0
    currentTime.value = 0
    audioDuration.value = 0
  }

  function _onTimeUpdate() {
    if (!audioEl) return
    currentTime.value = audioEl.currentTime
    audioDuration.value = audioEl.duration || 0
    progress.value = audioDuration.value > 0
      ? (audioEl.currentTime / audioDuration.value) * 100
      : 0
  }

  function _onEnded() {
    isPlaying.value = false
    progress.value = 0
    currentTime.value = 0
    if (audioEl) audioEl.currentTime = 0
  }

  function _onMeta() {
    if (!audioEl) return
    audioDuration.value = audioEl.duration || 0
  }

  function _initAudio(src: string) {
    _destroyAudio()
    if (!src) return
    audioEl = new Audio(src)
    audioEl.preload = 'metadata'
    audioEl.addEventListener('timeupdate', _onTimeUpdate)
    audioEl.addEventListener('ended', _onEnded)
    audioEl.addEventListener('loadedmetadata', _onMeta)
  }

  const totalDuration = computed(() =>
    audioDuration.value > 0 ? audioDuration.value : (activeItem.value?.duration ?? 0)
  )

  function openModal(item: ArchiveItem, index: number) {
    activeItem.value = item
    activeIndex.value = index
    isModalOpen.value = true
    _initAudio(item.audio)
  }

  function closeModal() {
    isModalOpen.value = false
    _destroyAudio()
  }

  function enterArchive() {
    isArchiveVisible.value = true
  }

  function goHome() {
    isArchiveVisible.value = false
    isModalOpen.value = false
    _destroyAudio()
  }

  function togglePlay() {
    if (!audioEl) return
    if (isPlaying.value) {
      audioEl.pause()
      isPlaying.value = false
    } else {
      audioEl.play().then(() => {
        isPlaying.value = true
      }).catch(() => {})
    }
  }

  function setProgress(val: number) {
    progress.value = val
    if (audioEl && audioDuration.value > 0) {
      audioEl.currentTime = (val / 100) * audioDuration.value
    }
  }

  function stopPlaying() {
    if (audioEl) audioEl.pause()
    isPlaying.value = false
  }

  const currentTimeFormatted = computed(() => {
    const secs = Math.floor(currentTime.value)
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  })

  const totalTimeFormatted = computed(() => {
    const d = Math.floor(totalDuration.value)
    const m = Math.floor(d / 60)
    const s = d % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  })

  return {
    albums,
    items,
    isModalOpen,
    activeItem,
    activeIndex,
    isArchiveVisible,
    isPlaying,
    progress,
    currentTimeFormatted,
    totalTimeFormatted,
    openModal,
    closeModal,
    enterArchive,
    goHome,
    togglePlay,
    setProgress,
    stopPlaying,
  }
})
