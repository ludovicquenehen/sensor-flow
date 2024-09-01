<template>
  <div class="relative flex items-center">
    <div class="flex gap-2 items-center">
      <div class="text-green-500 font-semibold">
        {{ sensor?.label }}
      </div>
      <i :class="`text-warning mdi mdi-${LOGIC_OPERATORS_ICON[node.operator]}`" />
      <div class="font-semibold">{{ node.value }}</div>
    </div>
    <div
      v-if="edit"
      class="absolute top-0 left-36 bg-current p-4 z-10 border border-1 border-white rounded white-shadow flex flex-col gap-2"
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
          :class="['button-warning w-10 flex justify-center items-center rounded-full', { fill: node.operator === operator}]"
					@click="node.operator = operator"
        >
          <i :class="`mdi mdi-${LOGIC_OPERATORS_ICON[operator]}`" />
        </button>
      </div>
      <input v-model="node.value" type="number" step="0.1" />
    </div>
  </div>
</template>

<script setup>
import useHardwareStore from '@/stores/use-hardware-store'
import { LOGIC_OPERATORS, LOGIC_OPERATORS_ICON } from '@/utils/operators'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const node = defineModel('node')
const sensor = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const sensors = computed(() => useHardwareStore.hardwares.filter((e) => e.type === 'SENSOR'))
</script>
