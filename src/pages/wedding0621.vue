<route lang="yaml">
  name: 'Wedding'
  meta:
    layout: false
</route>

<script setup lang="ts">
import { NButton, NSpin } from 'naive-ui'
import { fetchWeddingLive } from '@/hook/apis/ganhu'

const dialog = useDialog()

const title = ref('')
const weddingUrl = ref('')
const isOpen = ref(false)
const apiLoading = ref(true)
const imageLoaded = ref(false)
const loading = computed(() => apiLoading.value || !imageLoaded.value)

onMounted(async () => {
  const fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Italiana&family=Noto+Serif+TC:wght@300;400;500&display=swap'
  document.head.appendChild(fontLink)

  try {
    const data = await fetchWeddingLive()
    title.value = data.title
    weddingUrl.value = data.liveUrl
    isOpen.value = data.open === '開'
  } finally {
    apiLoading.value = false
  }
})

const handleLiveClick = (e: Event) => {
  if (!isOpen.value) {
    e.preventDefault()
    dialog.warning({
      title: '直播尚未開始',
      content: '直播尚未開始，敬請期待。',
      positiveText: '確定',
    })
  }
}
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 flex-center z-50"
    :style="{ background: 'radial-gradient(ellipse at center, #FBF6EC 0%, #F0E6D2 100%)' }"
  >
    <n-spin size="large" :stroke="'#6B2737'" />
  </div>

  <div
    v-show="!loading"
    class="min-h-screen w-full relative overflow-hidden"
    :style="{
      background: 'radial-gradient(ellipse at 20% 10%, #FBF6EC 0%, #F3E9D6 45%, #E8D9BF 100%)',
      fontFamily: '\'Cormorant Garamond\', \'Noto Serif TC\', serif',
      color: '#2A1E17',
    }"
  >
    <!-- Grain / paper texture -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
      :style="{
        backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;200&quot; height=&quot;200&quot;><filter id=&quot;n&quot;><feTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;2&quot; stitchTiles=&quot;stitch&quot;/><feColorMatrix values=&quot;0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0 0.1 0 0 0 0.5 0&quot;/></filter><rect width=&quot;100%&quot; height=&quot;100%&quot; filter=&quot;url(%23n)&quot;/></svg>\')',
      }"
    />

    <!-- Decorative corner ornaments (hidden on small screens to save space) -->
    <div
      class="hidden md:block absolute top-6 left-6 w-24 h-24 pointer-events-none opacity-60"
      :style="{ borderTop: '1px solid #B08D57', borderLeft: '1px solid #B08D57' }"
    />
    <div
      class="hidden md:block absolute top-6 right-6 w-24 h-24 pointer-events-none opacity-60"
      :style="{ borderTop: '1px solid #B08D57', borderRight: '1px solid #B08D57' }"
    />
    <div
      class="hidden md:block absolute bottom-6 left-6 w-24 h-24 pointer-events-none opacity-60"
      :style="{ borderBottom: '1px solid #B08D57', borderLeft: '1px solid #B08D57' }"
    />
    <div
      class="hidden md:block absolute bottom-6 right-6 w-24 h-24 pointer-events-none opacity-60"
      :style="{ borderBottom: '1px solid #B08D57', borderRight: '1px solid #B08D57' }"
    />

    <main class="relative max-w-5xl mx-auto px-5 md:px-8 py-4 md:py-20 min-h-screen flex flex-col items-center justify-start md:justify-center">
      <!-- Eyebrow -->
      <div
        class="flex items-center gap-3 md:gap-4 mb-3 md:mb-8 opacity-0"
        style="animation: weddingFadeUp 1s ease-out 0.05s forwards"
      >
        <span class="block w-8 md:w-12 h-px" :style="{ background: '#B08D57' }" />
        <span
          class="text-[0.6rem] md:text-[0.7rem] tracking-[0.4em] md:tracking-[0.5em] uppercase"
          :style="{ color: '#6B2737', fontFamily: '\'Italiana\', serif' }"
        >
          Live · 婚禮直播
        </span>
        <span class="block w-8 md:w-12 h-px" :style="{ background: '#B08D57' }" />
      </div>

      <!-- Title (compact on mobile) -->
      <h1
        class="text-center opacity-0 px-2"
        :style="{
          fontFamily: '\'Italiana\', \'Noto Serif TC\', serif',
          fontSize: 'clamp(1.65rem, 6vw, 4.75rem)',
          lineHeight: '1.1',
          letterSpacing: '0.02em',
          color: '#2A1E17',
          animation: 'weddingFadeUp 1.2s ease-out 0.2s forwards',
        }"
      >
        {{ title }}
      </h1>

      <!-- Ornamental divider (compact) -->
      <div
        class="my-3 md:my-8 flex items-center gap-3 opacity-0"
        style="animation: weddingFadeUp 1s ease-out 0.35s forwards"
      >
        <span class="block w-12 md:w-20 h-px" :style="{ background: 'linear-gradient(to right, transparent, #B08D57)' }" />
        <svg width="12" height="12" viewBox="0 0 14 14">
          <path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z" fill="#B08D57" />
        </svg>
        <span class="block w-12 md:w-20 h-px" :style="{ background: 'linear-gradient(to left, transparent, #B08D57)' }" />
      </div>

      <!-- Framed photograph -->
      <a
        :href="isOpen ? weddingUrl : undefined"
        :target="isOpen ? '_blank' : undefined"
        rel="noopener"
        class="block relative group opacity-0 cursor-pointer"
        @click="handleLiveClick"
        :style="{
          width: 'min(440px, 78vw)',
          maxHeight: '46vh',
          animation: 'weddingFadeUp 1.2s ease-out 0.5s forwards',
        }"
      >
        <!-- Gold frame -->
        <div
          class="absolute -inset-2 md:-inset-3 pointer-events-none transition-all duration-700 group-hover:-inset-4"
          :style="{
            border: '1px solid #B08D57',
            background: 'linear-gradient(135deg, rgba(176,141,87,0.08), transparent 40%, rgba(176,141,87,0.08))',
          }"
        />
        <div
          class="absolute -inset-1 pointer-events-none"
          :style="{ border: '1px solid rgba(176,141,87,0.4)' }"
        />

        <div
          class="relative overflow-hidden"
          :style="{ boxShadow: '0 20px 40px -16px rgba(60,30,15,0.35), 0 6px 16px -8px rgba(107,39,55,0.2)' }"
        >
          <img
            src="/wedding.jpg"
            alt="Wedding"
            class="block w-full h-auto transition-all duration-[1200ms] ease-out group-hover:scale-[1.04]"
            :style="{ filter: 'sepia(0.08) saturate(0.95) contrast(1.02)', maxHeight: '46vh', objectFit: 'cover' }"
            @load="imageLoaded = true"
            @error="imageLoaded = true"
          />
          <!-- Vignette -->
          <div
            class="absolute inset-0 pointer-events-none"
            :style="{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(42,30,23,0.25) 100%)' }"
          />
        </div>
      </a>

      <!-- CTA -->
      <div
        class="mt-6 md:mt-12 opacity-0"
        style="animation: weddingFadeUp 1s ease-out 0.7s forwards"
      >
        <n-button
          tag="a"
          :href="isOpen ? (weddingUrl || undefined) : undefined"
          :target="isOpen ? '_blank' : undefined"
          rel="noopener"
          :disabled="!weddingUrl"
          size="large"
          @click="handleLiveClick"
          class="wedding-cta"
          :style="{
            '--n-color': '#6B2737',
            '--n-color-hover': '#82364A',
            '--n-color-pressed': '#561E2D',
            '--n-color-focus': '#6B2737',
            '--n-text-color': '#FBF6EC',
            '--n-text-color-hover': '#FBF6EC',
            '--n-text-color-pressed': '#FBF6EC',
            '--n-text-color-focus': '#FBF6EC',
            '--n-border': '1px solid #6B2737',
            '--n-border-hover': '1px solid #82364A',
            '--n-border-pressed': '1px solid #561E2D',
            '--n-border-focus': '1px solid #6B2737',
            '--n-height-large': '52px',
            '--n-padding-large': '0 40px',
            '--n-font-size-large': '0.9rem',
            '--n-border-radius': '0px',
            fontFamily: '\'Italiana\', serif',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            boxShadow: '0 14px 30px -12px rgba(107,39,55,0.5)',
            transition: 'all 0.5s ease',
          }"
        >
          點擊進入直播
        </n-button>
      </div>

      <!-- Footer mark (hidden on mobile to keep above-the-fold) -->
      <div
        class="hidden md:flex mt-16 flex-col items-center gap-3 opacity-0"
        style="animation: weddingFadeUp 1.2s ease-out 0.95s forwards"
      >
        <span class="block w-px h-10" :style="{ background: 'linear-gradient(to bottom, transparent, #B08D57)' }" />
        <span
          class="text-[0.65rem] tracking-[0.5em] uppercase"
          :style="{ color: '#8a6a3a', fontFamily: '\'Italiana\', serif' }"
        >
          MMXXVI · est. love
        </span>
      </div>
    </main>
  </div>
</template>

<style>
@keyframes weddingFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wedding-cta:hover {
  letter-spacing: 0.5em !important;
  box-shadow: 0 18px 36px -12px rgba(107, 39, 55, 0.6) !important;
}
</style>
