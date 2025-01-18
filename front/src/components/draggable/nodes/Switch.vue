<template>
  <div class="flex flex-col gap-2">
    <div v-if="!edit" class="text-plum font-semibold mt-1">
      <template v-if="switchNode">{{ switchNode?.label }}</template>
      <i v-else :class="`mdi mdi-${HARDWARE_TYPE_ICON.SWITCH}`" />
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
const switchNode = computed(() =>
  useHardwareStore.hardwares.find((e) => e.id === node.value.idHardware)
)
const projectId = computed(
  () => useProgramStore.programs.find((p) => p.id == route.params.id)?.projectId
)
const actuators = computed(() =>
  useHardwareStore.hardwares.filter((e) => e.type == 'ACTUATOR' && e.projectId == projectId.value)
)
</script>
