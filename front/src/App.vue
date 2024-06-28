<template>
  <div v-if="!useAppStore.loading">
    <Toolbar :items="toolbarItems" />
    <Navbar :items="navbarItems" />
    <a
      href="https://github.com/ludovicquenehen/sensor-flow"
      class="fixed bottom-1 right-1 text-white text-xs"
      >sensor-flow v{{ version }}</a
    >
  </div>
  <span v-else class="loader"> </span>
	<RouterView v-if="!useAppStore.loading" />
</template>
<script setup>
import { version } from '@/../package.json'
import { RouterView } from 'vue-router'
import useAppStore from '@/stores/use-app-store'
import useUserStore from '@/stores/use-user-store'
import useProjectStore from '@/stores/use-project-store'
import Navbar from '@/components/app/Navbar.vue'
import Toolbar from '@/components/app/Toolbar.vue'
import useHardwareStore from './stores/use-hardware-store'

const router = useRouter()
const route = useRoute()

const logout = async () => {
  await useUserStore.logout()
  router.push('/login')
}

const navbarItems = computed(() =>
  [
    {
      iconClass: () => [
        'mdi mdi-view-dashboard text-4xl cursor-pointer hover:text-cyan-600 hover:text-5xl',
        { 'text-cyan-600': route.path === '/' }
      ],
      action: () => router.push('/')
    },
    {
      iconClass: () => [
        'mdi mdi-transit-connection-variant text-4xl cursor-pointer hover:text-cyan-600 hover:text-5xl',
        { 'text-cyan-600': route.path === '/flow' }
      ],
      action: () => router.push('/flow')
    },
    useUserStore.isAdmin && { separator: true },
    useUserStore.isAdmin && {
      iconClass: () => [
        'mdi mdi-shield-account text-4xl cursor-pointer hover:text-yellow-600 hover:text-5xl',
        { 'text-yellow-600': route.path.startsWith('/admin/user') }
      ],
      action: () => router.push('/admin/user')
    },
    useUserStore.isAdmin && {
      iconClass: () => [
        'mdi mdi-sitemap-outline text-4xl cursor-pointer hover:text-yellow-600 hover:text-5xl',
        { 'text-yellow-600': route.path.startsWith('/admin/project') }
      ],
      action: () => router.push('/admin/project')
    },
		useUserStore.isAdmin && {
      iconClass: () => [
        'mdi mdi-car-esp text-4xl cursor-pointer hover:text-yellow-600 hover:text-5xl',
        { 'text-yellow-600': route.path.startsWith('/admin/hardware') }
      ],
      action: () => router.push('/admin/hardware')
    }
  ].filter(Boolean)
)
const toolbarItems = computed(() => [
  {
    iconClass: 'mdi mdi-account',
    color: 'action',
    fill: route.path === '/user',
    action: () => router.push('/user')
  },
  {
    iconClass: 'mdi mdi-logout',
    color: 'red',
    action: logout
  }
])

onMounted(async () => {
  setTimeout(async () => {
    if (!['/login', '/sign-in', '/confirm-account', '/forgot-password'].includes(route.path)) {
      useAppStore.loading = true
      await useUserStore.me()
      await useProjectStore.fetch(true)
      await useUserStore.fetch(true)
			await useHardwareStore.fetch(true)
    }
    setTimeout(() => {
      useAppStore.loading = false
    }, 1000)
  }, 10)
})
</script>
