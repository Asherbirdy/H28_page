<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div>
    <router-view
      v-slot="{ Component }"
      class="w-full"
    >
      <transition name="pagefade">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>