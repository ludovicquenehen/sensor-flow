<template>
  <div class="relative flex items-center">
    <div class="flex flex-col gap-2">
      <div class="font-semibold py-2">
        <i :class="`mdi mdi-${TIME_MODE_ICON[node.mode]}`" />
        {{ node.start }} - {{ node.end }}
        <template v-if="node.mode === 'INTERVAL'">({{ node.on }} / {{ node.off }})</template>
      </div>
      <div
        v-if="edit"
        class="absolute top-4 left-36 bg-current p-4 z-10 border border-1 border-white rounded white-shadow flex flex-col gap-2"
      >
        <div class="flex gap-1">
          <button
            v-for="timeMode in TIME_MODE"
            :class="[
              'button-warning w-10 flex justify-center items-center rounded-full',
              { fill: timeMode === node.mode }
            ]"
            @click="node.mode = timeMode"
          >
            <i :class="`mdi mdi-${TIME_MODE_ICON[timeMode]}`" />
          </button>
        </div>
        <input v-model="node.start" type="time" />
        <input v-model="node.end" type="time" />
        <template v-if="node.mode === 'INTERVAL'">
          <input v-model="node.on" type="time" />
          <input v-model="node.off" type="time" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TIME_MODE, TIME_MODE_ICON } from '@/utils/time-mode'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const node = defineModel('node')
</script>
