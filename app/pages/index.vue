<template>
  <div style="background: var(--bg-color); min-height: 100vh;">
    <TheNav />
    <main>
      <LandingSection />
      <ArchiveSection />
    </main>
    <TrackModal />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'zero day',
  meta: [
    { name: 'description', content: 'zero day — мемориальный архив' }
  ]
})
</script>
