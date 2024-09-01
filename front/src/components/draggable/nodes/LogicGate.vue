<template>
  <div class="flex flex-col gap-2">
    <div v-if="!edit" class="text-blue-500 font-semibold mt-1 flex items-center gap-1">
      <i :class="`text-xl mdi mdi-gate-${node.type}`" />
      {{ node.type.toUpperCase() }}
    </div>
    <div v-else class="flex gap-1">
      <button
        v-for="gate of LOGIC_GATES"
        class="button-action w-10 flex justify-center items-center rounded-full"
        @click="node.type = gate"
      >
        <i :class="`mdi mdi-gate-${gate}`" />
      </button>
    </div>
  </div>
</template>

<script setup>
import useHardwareStore from '@/stores/use-hardware-store'
import { LOGIC_GATES } from '@/utils/gates'

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
</script>
