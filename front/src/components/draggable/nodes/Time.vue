<template>
  <div class="relative flex items-center">
    <div class="flex flex-col gap-2">
      <div class="font-semibold py-2">
        <i :class="`mdi mdi-${TIME_MODE_ICON[node.mode]}`" />
        <template v-if="node.mode !== 'WEEK'">{{ node.start }} / {{ node.end }}</template>
        <template v-else>{{ node.days?.sort().map((e) => WEEK_DAYS[e]).join(', ') }}</template>
        <template v-if="node.mode === 'INTERVAL'">({{ node.on }} / {{ node.off }})</template>
      </div>
      <div v-if="edit" class="w-full h-full bg-white/10">
        <div class="absolute top-1/4 left-1/2">
          <div
            class="relative flex flex-col gap-2 bg-current z-10 px-6 py-4 rounded-lg border border-white/50 shadow-white/10 shadow-lg"
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
            <template v-if="node.mode !== 'WEEK'">
              <input v-model="node.start" type="time" />
              <input v-model="node.end" type="time" />
              <template v-if="node.mode === 'INTERVAL'">
                <input v-model="node.on" type="time" />
                <input v-model="node.off" type="time" />
              </template>
            </template>
            <div v-else class="flex gap-1">
              <button
                v-for="(day, index) in WEEK_DAYS"
                :class="[
                  'button rounded-full w-10',
                  { 'button-white': node.days?.includes(index) }
                ]"
                @click="handleClickDay(index)"
              >
                {{ day.slice(0, 1) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TIME_MODE, TIME_MODE_ICON, WEEK_DAYS } from '@/utils/time-mode'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const node = defineModel('node')

const handleClickDay = (day) => {
  if (!node.value.days) {
    node.value.days = []
  }
  const index = node.value.days.findIndex((e) => e === day)
  if (index >= 0) {
    node.value.days.splice(index, 1)
  } else {
    node.value.days.push(day)
  }
}
</script>
