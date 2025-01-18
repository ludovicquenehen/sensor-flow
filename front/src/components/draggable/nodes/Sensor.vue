<template>
  <div class="flex items-center">
    <div class="text-green-500 font-semibold">
      <template v-if="sensor">{{ sensor?.label }}</template>
      <i v-else :class="`mdi mdi-${HARDWARE_TYPE_ICON.SENSOR}`" />
    </div>
    <i :class="`text-warning mdi mdi-${LOGIC_OPERATORS_ICON[node.operator]}`" />
    <div class="font-semibold">{{ node.value }}</div>
  </div>
  <div v-if="edit" class="relative w-full h-full bg-white/10">
    <div class="absolute top-1/4 left-1/2">
      <div
        class="relative flex flex-col gap-2 bg-current z-10 px-6 py-4 rounded-lg border border-white/50 shadow-white/10 shadow-lg"
      >
        <select v-model="node.idHardware">
          <option disabled value="">Sensor</option>
          <option v-for="hardware in sensors" :value="hardware.id">
            {{ hardware.label }}
          </option>
        </select>
        <div class="flex gap-1">
          <button
            v-for="operator of LOGIC_OPERATORS"
            :class="[
              'button-warning w-10 flex justify-center items-center rounded-full',
              { fill: node.operator === operator }
            ]"
            @click="node.operator = operator"
          >
            <i :class="`mdi mdi-${LOGIC_OPERATORS_ICON[operator]}`" />
          </button>
        </div>
        <input v-model="node.value" type="number" step="0.1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useHardwareStore from '@/stores/use-hardware-store'
import useProgramStore from '@/stores/use-program-store'
import { LOGIC_OPERATORS, LOGIC_OPERATORS_ICON } from '@/utils/operators'
import { HARDWARE_TYPE_ICON } from '@/utils/hardwares'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const route = useRoute()
const node = defineModel('node')
const sensor = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const projectId = computed(
  () => useProgramStore.programs.find((p) => p.id == route.params.id)?.projectId
)
const sensors = computed(() =>
  useHardwareStore.hardwares.filter((e) => e.type === 'SENSOR' && e.projectId === projectId.value)
)
</script>
