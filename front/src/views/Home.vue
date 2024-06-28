<template>
  <div v-if="true" class="flex flex-col gap-8">
		Welcome
  </div>
  <div v-else-if="!useUserStore.isAdmin" class="flex flex-col text-center gap-8 mt-28">
    <i class="mdi mdi-emoticon-sad text-9xl text-orange-500" />
    <span class="text-5xl text-bold">Sorry...</span>
    <span class="text-2xl font-semibold">
      You must contact your organization admin to add you to a project or run a first test
    </span>
    <button class="button-white w-48 mx-auto">
      <a href="mailto:admin@admin.com">Contact admin</a>
    </button>
  </div>
  <div v-else class="flex flex-col text-center gap-8 mt-28">
    <i class="mdi mdi-check-circle text-9xl text-green-500" />
    <span class="text-5xl text-bold">Welcome !</span>
    <span class="text-2xl font-semibold">
      You must configure a project and run a first test to start
    </span>
    <div class="flex md:flex-row flex-col justify-center items-center gap-2">
      <button class="button-white w-48" @click="router.push('/admin/project')">
        Create first project
      </button>
      <button class="button-white w-48" @click="router.push('/admin/runner')">
        Run first test
      </button>
    </div>
  </div>
</template>
<script setup>
import useUserStore from '@/stores/use-user-store'

const router = useRouter()
</script>
<style></style>
