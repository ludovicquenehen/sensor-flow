<template>
  <div class="view dnd-flow" @drop="onDrop">
    <Sidebar :items="navbarLeft" />
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease'
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
    </VueFlow>
    <Sidebar :items="navbarRight" />
  </div>
  <button @click="evalFlow">Evaluate</button>
  <div>
    {{ filteredFlows }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import DropzoneBackground from '@/components/flow/DropzoneBackground.vue'
import Sidebar from '@/components/flow/Sidebar.vue'
import useDragAndDrop from '@/composables/useDnD'
import useHardwareStore from '@/stores/use-hardware-store'

const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
onConnect(addEdges)

const nodes = ref([])
const edges = ref([])

const sensors = computed(() =>
  useHardwareStore.hardwares
    .filter((e) => e.type === 'SENSOR')
    .map((e) => ({ ...e, type: 'input' }))
)

const relays = computed(() =>
  useHardwareStore.hardwares
    .filter((e) => e.type === 'ACTUATOR')
    .map((e) => ({ ...e, type: 'output' }))
)

const switches = computed(() =>
  useHardwareStore.hardwares
    .filter((e) => e.type === 'SWITCH')
    .map((e) => ({ ...e, type: 'input' }))
)

const logics = ref([
  { id: 1, label: 'OR', type: 'or' },
  { id: 2, label: 'AND', type: 'and' },
  { id: 3, label: 'XOR', type: 'xor' },
  { id: 6, label: 'NOT', type: 'not' },
  { id: 5, label: 'IF', type: 'if' }
])

const navbarLeft = computed(() => [
  ...sensors.value,
	...switches.value,
  ...relays.value.map((e) => ({ ...e, type: 'input' }))
])
const navbarRight = computed(() => [...logics.value, ...relays.value])

/** Debug */
const inputNodes = computed(() => nodes.value.filter((e) => e.type === 'input'))
const outputNodes = computed(() => nodes.value.filter((e) => e.type === 'output'))
const logicNodes = computed(() => nodes.value.filter((e) => !['input', 'output'].includes(e.type)))

const buildFlow = (current, flow = []) => {
  const connectedEdges = edges.value.filter((e) => e.target === current.id)
  if (connectedEdges.length) {
    const intermediateFlow = connectedEdges.map((c) => {
      const next = nodes.value.find((n) => n.id === c.source)
      if (next) {
        let f = [...flow]
        f.push(current.id)
        const buildedFlow = buildFlow(next, f)
          .map((e) => e.id)
          .filter(Boolean)
        f.push(...buildedFlow)
        return f
      }
    })

    flow.push(...intermediateFlow.filter(Boolean))
  } else {
    flow.push(current.id)
  }
  return flow
}

const filteredFlows = ref([])
const filterFlow = (current) => {
  if (Array.isArray(current) && current.find((e) => Array.isArray(e))) {
    current = current.map((e) => filterFlow(e)).filter(Boolean)
  } else {
    const findInput = inputNodes.value.find((e) => current.includes(e.id))
    const findOutput = outputNodes.value.find((e) => current.includes(e.id))
    if (findInput && findOutput) {
      filteredFlows.value.push(current.reverse())
    }
  }
}

const evalFlow = () => {
  filteredFlows.value = []
  let evaluatedFlow = outputNodes.value.map((e) => buildFlow(e))
  evaluatedFlow.forEach((e) => filterFlow(e))
}
evalFlow()
</script>
