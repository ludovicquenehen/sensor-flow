<template>
  <div class="flex flex-col gap-2">
    <div v-if="!edit" class="text-plum font-semibold mt-1">
      {{ switchNode?.label }}
    </div>
    <select v-else v-model="node.idHardware">
      <option disabled value="">Actuator</option>
      <option v-for="hardware in actuators" :value="hardware.id">
        {{ hardware.label }}
      </option>
    </select>
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
const switchNode = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const actuators = computed(() => useHardwareStore.hardwares.filter((e) => e.type === 'ACTUATOR'))
</script>
