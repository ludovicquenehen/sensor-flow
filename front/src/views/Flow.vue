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

const { onConnect, addEdges } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

// const nodes = ref([])
// const edges = ref([])

onConnect(addEdges)

/** Fake datas */
const relays = ref([
  { id: 1, label: 'Relay 1', type: 'output' },
  { id: 2, label: 'Relay 2', type: 'output' },
  { id: 3, label: 'Relay 3', type: 'output' }
])

const sensors = ref([
  { id: 1, label: 'Temperature', type: 'input' },
  { id: 2, label: 'Humidity', type: 'input' },
  { id: 3, label: 'Luminosity', type: 'input' }
])

const logics = ref([
  { id: 1, label: 'OR', type: 'or' },
  { id: 2, label: 'AND', type: 'and' },
  { id: 3, label: 'XOR', type: 'xor' },
  { id: 6, label: 'NOT', type: 'not' },
  { id: 5, label: 'IF', type: 'if' }
])
/** */

const navbarLeft = computed(() => [
  ...sensors.value,
  ...relays.value.map((e) => ({ ...e, type: 'input' }))
])
const navbarRight = computed(() => [...logics.value, ...relays.value])

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

const inputNodes = computed(() => nodes.value.filter((e) => e.type === 'input'))
const outputNodes = computed(() => nodes.value.filter((e) => e.type === 'output'))
const logicNodes = computed(() => nodes.value.filter((e) => !['input', 'output'].includes(e.type)))
const evalFlow = () => {
	filteredFlows.value = []
  const evaluatedFlow = outputNodes.value.map((e) => buildFlow(e))
  return evaluatedFlow.filter((e) => filterFlow(e))
}

const nodes = ref([
  {
    id: 'dndnode_0',
    type: 'input',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 91.75, y: 45.5, z: 0 },
    handleBounds: {
      source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
      target: []
    },
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 91.75, y: 45.5 },
    data: { label: 'Temperature', id: 1, type: 'input' },
    events: {}
  },
  {
    id: 'dndnode_1',
    type: 'input',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 381.75, y: 58.5, z: 0 },
    handleBounds: {
      source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
      target: []
    },
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 381.75, y: 58.5 },
    data: { label: 'Luminosity', id: 3, type: 'input' },
    events: {}
  },
  {
    id: 'dndnode_2',
    type: 'and',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 242.75, y: 229.5, z: 0 },
    handleBounds: {
      source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
      target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
    },
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 242.75, y: 229.5 },
    data: { label: 'AND', id: 2, type: 'and' },
    events: {}
  },
  {
    id: 'dndnode_3',
    type: 'if',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 127.75, y: 144.5, z: 0 },
    handleBounds: {
      source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
      target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
    },
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 127.75, y: 144.5 },
    data: { label: 'IF', id: 5, type: 'if' },
    events: {}
  },
  {
    id: 'dndnode_4',
    type: 'if',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 324.75, y: 149.5, z: 0 },
    handleBounds: {
      source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
      target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
    },
    selected: false,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 324.75, y: 149.5 },
    data: { label: 'IF', id: 5, type: 'if' },
    events: {}
  },
  {
    id: 'dndnode_5',
    type: 'output',
    dimensions: { width: 150, height: 41 },
    computedPosition: { x: 248.75, y: 357.5, z: 1000 },
    handleBounds: {
      source: [],
      target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
    },
    selected: true,
    dragging: false,
    resizing: false,
    initialized: false,
    isParent: false,
    position: { x: 248.75, y: 357.5 },
    data: { label: 'Relay 1', id: 1, type: 'output' },
    events: {}
  }
])
const edges = ref([
  {
    id: 'vueflow__edge-dndnode_0-dndnode_3',
    type: 'default',
    source: 'dndnode_0',
    target: 'dndnode_3',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_0',
      type: 'input',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 91.75, y: 45.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: []
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 91.75, y: 45.5 },
      data: { label: 'Temperature', id: 1, type: 'input' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_3',
      type: 'if',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 127.75, y: 144.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 127.75, y: 144.5 },
      data: { label: 'IF', id: 5, type: 'if' },
      events: {}
    },
    sourceX: 166.75,
    sourceY: 88.6875,
    targetX: 202.75,
    targetY: 142.5
  },
  {
    id: 'vueflow__edge-dndnode_3-dndnode_2',
    type: 'default',
    source: 'dndnode_3',
    target: 'dndnode_2',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_3',
      type: 'if',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 127.75, y: 144.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 127.75, y: 144.5 },
      data: { label: 'IF', id: 5, type: 'if' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_2',
      type: 'and',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 242.75, y: 229.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 242.75, y: 229.5 },
      data: { label: 'AND', id: 2, type: 'and' },
      events: {}
    },
    sourceX: 202.75,
    sourceY: 187.6875,
    targetX: 317.75,
    targetY: 227.5
  },
  {
    id: 'vueflow__edge-dndnode_2-dndnode_5',
    type: 'default',
    source: 'dndnode_2',
    target: 'dndnode_5',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_2',
      type: 'and',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 242.75, y: 229.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 242.75, y: 229.5 },
      data: { label: 'AND', id: 2, type: 'and' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_5',
      type: 'output',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 248.75, y: 357.5, z: 0 },
      handleBounds: {
        source: [],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 248.75, y: 357.5 },
      data: { label: 'Relay 1', id: 1, type: 'output' },
      events: {}
    },
    sourceX: 317.75,
    sourceY: 272.6875,
    targetX: 323.75,
    targetY: 355.5
  },
  {
    id: 'vueflow__edge-dndnode_4-dndnode_2',
    type: 'default',
    source: 'dndnode_4',
    target: 'dndnode_2',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_4',
      type: 'if',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 324.75, y: 149.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 324.75, y: 149.5 },
      data: { label: 'IF', id: 5, type: 'if' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_2',
      type: 'and',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 242.75, y: 229.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 242.75, y: 229.5 },
      data: { label: 'AND', id: 2, type: 'and' },
      events: {}
    },
    sourceX: 399.75,
    sourceY: 192.6875,
    targetX: 317.75,
    targetY: 227.5
  },
  {
    id: 'vueflow__edge-dndnode_1-dndnode_4',
    type: 'default',
    source: 'dndnode_1',
    target: 'dndnode_4',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_1',
      type: 'input',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 381.75, y: 58.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: []
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 381.75, y: 58.5 },
      data: { label: 'Luminosity', id: 3, type: 'input' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_4',
      type: 'if',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 324.75, y: 149.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 324.75, y: 149.5 },
      data: { label: 'IF', id: 5, type: 'if' },
      events: {}
    },
    sourceX: 456.75,
    sourceY: 101.6875,
    targetX: 399.75,
    targetY: 147.5
  },
  {
    id: 'vueflow__edge-dndnode_0-dndnode_4',
    type: 'default',
    source: 'dndnode_0',
    target: 'dndnode_4',
    sourceHandle: null,
    targetHandle: null,
    data: {},
    events: {},
    label: '',
    sourceNode: {
      id: 'dndnode_0',
      type: 'input',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 91.75, y: 45.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: []
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 91.75, y: 45.5 },
      data: { label: 'Temperature', id: 1, type: 'input' },
      events: {}
    },
    targetNode: {
      id: 'dndnode_4',
      type: 'if',
      dimensions: { width: 150, height: 41 },
      computedPosition: { x: 324.75, y: 149.5, z: 0 },
      handleBounds: {
        source: [{ id: null, position: 'bottom', x: 72, y: 37.1875, width: 6, height: 6 }],
        target: [{ id: null, position: 'top', x: 72, y: -2, width: 6, height: 6 }]
      },
      selected: false,
      dragging: false,
      resizing: false,
      initialized: false,
      isParent: false,
      position: { x: 324.75, y: 149.5 },
      data: { label: 'IF', id: 5, type: 'if' },
      events: {}
    },
    sourceX: 166.75,
    sourceY: 88.6875,
    targetX: 399.75,
    targetY: 147.5
  }
])

evalFlow()
</script>
