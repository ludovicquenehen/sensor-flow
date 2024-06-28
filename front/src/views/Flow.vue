<template>
  <div class="ml-32 flex">
    <div>
      <div class="flex gap-4 items-center mb-8">
        <div class="text-xl text-white">Flows</div>
        <div class="flex gap-4 mt-4">
          <select v-model="form.projectId">
            <option disabled :value="null">Project</option>
            <option v-for="project in useProjectStore.projects" :value="project.id">
              {{ project.label }}
            </option>
          </select>
          <select v-model="currentFlowId">
            <option disabled :value="null">Flows</option>
            <option
              v-for="flow in useFlowStore.flows.filter((e) => e.projectId === form.projectId)"
              :value="flow.id"
            >
              {{ flow.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex md:flex-row flex-col gap-2 mt-4">
        <input v-model="form.label" placeholder="Label" type="text" />
        <Checkbox v-model="form.active" />
        <input v-model="form.from" placeholder="From" type="date" />
        <input v-model="form.to" placeholder="To" type="date" />
        <button
          :disabled="Object.values(form).some((e) => e === '')"
          class="button-green md:w-16"
          @click="useFlowStore.add(form)"
        >
          <i class="mdi mdi-send" />
        </button>
        <button class="button-white md:w-16 ml-16" @click="save">
          <i class="mdi mdi-content-save" />
        </button>
      </div>
    </div>

    <div v-if="currentFlowId" class="absolute dnd-flow mt-32" @drop="onDrop">
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
    <!-- <button @click="evalFlow">Evaluate</button>
  <div>
    {{ filteredFlows }}
  </div> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import DropzoneBackground from '@/components/flow/DropzoneBackground.vue'
import Sidebar from '@/components/flow/Sidebar.vue'
import useDragAndDrop from '@/composables/useDnD'
import useHardwareStore from '@/stores/use-hardware-store'
import useFlowStore from '@/stores/use-flow-store'
import Checkbox from '@/components/inputs/Checkbox.vue'
import useProjectStore from '@/stores/use-project-store'

const form = ref({
  label: '',
  projectId: null,
  active: false,
  from: null,
  to: null
})

const currentFlowId = ref(null)
const currentFlow = computed(() => useFlowStore.flows.find((e) => e.id === currentFlowId.value))

const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
onConnect(addEdges)

const nodes = ref([])
const edges = ref([])

watch(
  () => currentFlowId.value,
  () => {
		console.log('set')
    nodes.value = currentFlow.value.schema?.nodes || []
		edges.value = currentFlow.value.schema?.edges || []
  }
)

const save = async () => {
  await useFlowStore.update(currentFlowId.value, {
    ...currentFlow.value,
    schema: {
			nodes: nodes.value,
			edges: edges.value
		}
  })
}

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
const logicNodes = computed(() =>
  nodes.value.filter((e) => !['input', 'output'].includes(e.type))
)

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
