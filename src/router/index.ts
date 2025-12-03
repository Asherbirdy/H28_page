// @ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { createRouter, createWebHashHistory } from 'vue-router'

import config from '@/config'
const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHashHistory(config.baseUrl),
  routes
})

export default router
