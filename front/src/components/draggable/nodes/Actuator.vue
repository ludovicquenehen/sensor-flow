<template>
  <div class="relative flex items-center">
    <div class="flex gap-2 items-center">
      <div class="text-red-500 font-semibold">
        {{ actuator?.label }}
      </div>
      <i
        :class="`text-xl ${node.state ? 'text-warning' : 'text-white'} mdi mdi-${node.state ? 'led-on' : 'led-off'}`"
      />
      <div class="font-semibold">{{ node.value }}</div>
    </div>
    <div
      v-if="edit"
      class="absolute top-10 bg-current p-4 z-10 border border-1 border-white rounded white-shadow flex flex-col gap-2"
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
</template>

<script setup>
import useHardwareStore from '@/stores/use-hardware-store'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  }
})
const node = defineModel('node')
const actuator = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const actuators = computed(() => useHardwareStore.hardwares.filter((e) => e.type === 'ACTUATOR'))
</script>
