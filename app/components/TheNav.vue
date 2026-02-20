<template>
  <nav class="fixed top-0 left-0 w-full z-[100] flex justify-between items-start nav-safe"
       style="background: linear-gradient(180deg, rgba(10,10,10,0.9) 0%, transparent 100%); padding: 1.5rem 1rem;">
    <div class="flex flex-col gap-1">
      <span
        class="font-sans text-[0.75rem] tracking-[0.2em] lowercase cursor-pointer opacity-50 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 md:text-[0.8rem]"
        style="color: var(--text-primary);"
        @click="store.goHome()"
      >zero day</span>
      <span class="text-[0.6rem] tracking-[0.15em] lowercase md:text-[0.65rem]" style="color: var(--text-muted);">мемориальный архив</span>
    </div>
    <div class="text-right text-[0.6rem] tracking-[0.15em] uppercase md:text-[0.65rem]" style="color: var(--text-muted);">
      <span class="inline-block w-1 h-1 rounded-full mr-1.5 animate-pulse-dot" style="background: var(--text-muted);"></span>
      активен
    </div>
  </nav>
</template>

<script setup lang="ts">
const store = useArchiveStore()
</script>
