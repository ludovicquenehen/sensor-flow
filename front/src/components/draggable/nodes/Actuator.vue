<template>
  <div class="relative flex items-center">
    <div class="flex gap-2 items-center">
      <div class="text-red-500 font-semibold">
        <template v-if="actuator">
          {{ actuator?.label }}
          <i
            :class="`text-xl ${node.state ? 'text-warning' : 'text-white'} mdi mdi-${node.state ? 'led-on' : 'led-off'}`"
          />
        </template>
        <i v-else :class="`mdi mdi-${HARDWARE_TYPE_ICON.ACTUATOR}`" />
      </div>

      <div class="font-semibold">{{ node.value }}</div>
    </div>
    <div v-if="edit" class="relative w-full h-full bg-white/10">
      <div class="absolute top-1/4 left-1/2">
        <div
          :class="['relative flex flex-col gap-2 bg-current z-10 px-6 py-4 rounded-lg border border-white/50 shadow-white/10 shadow-lg', { 'border-2': edit }]"
        >
          <select v-model="node.idHardware">
            <option disabled value="">Actuator</option>
            <option v-for="hardware in actuators" :value="hardware.id">
              {{ hardware.label }}
            </option>
          </select>
          <select v-model="node.state">
            <option disabled value="">State</option>
            <option v-for="state in [true, false]" :value="state">
              {{ state ? 'ON' : 'OFF' }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useHardwareStore from '@/stores/use-hardware-store'
import useProgramStore from '@/stores/use-program-store'
import { HARDWARE_TYPE_ICON } from '@/utils/hardwares'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const route = useRoute()
const node = defineModel('node')
const actuator = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const projectId = computed(
  () => useProgramStore.programs.find((p) => p.id == route.params.id)?.projectId
)
const actuators = computed(() =>
  useHardwareStore.hardwares.filter((e) => e.type === 'ACTUATOR' && e.projectId == projectId.value)
)
</script>
