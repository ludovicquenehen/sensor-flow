<template>
  <div :class="['flex gap-2', { 'flex-col': !root }]">
    <div
      v-for="(node, index) of nodes"
      :key="node.id"
      :class="[
        'border border-1 px-4 py-2 flex flex-col gap-1',
        {
          'button-white': node.type === 'SWITCH',
          'button-green': node.type === 'SENSOR',
          'button-red': node.type === 'ACTUATOR',
          'button-action': ![...HARDWARE_TYPE, 'TIME'].includes(node.type)
        }
      ]"
    >
      <Node
        v-model:node="nodes[index]"
        v-model:edited="edited"
				v-model:selected="selected"
        @remove-node="removeNode"
        @click="handleSelect(node.id)"
      />
      <Nested
        v-if="node.children"
        v-model:nodes="node.children"
        v-model:selected="selected"
        class="ml-2"
      />
    </div>
  </div>
</template>

<script setup>
// import { VueDraggable } from 'vue-draggable-plus'
import Node from '@/components/draggable/Node.vue'
import { HARDWARE_TYPE } from '@/utils/hardwares'
const emit = defineEmits(['removeNode'])

const props = defineProps({
  root: {
    type: Boolean,
    default: false
  }
})
const nodes = defineModel('nodes')
const selected = defineModel('selected')
const edited = defineModel('edited')

const handleSelect = (nodeId) => {
  if (selected.value === nodeId) {
    selected.value = null
  } else {
    selected.value = nodeId
  }
}

const removeNode = (id) => {
  console.log(
    'removeNode',
    id,
    nodes.value,
    nodes.value.findIndex((e) => e.id === id)
  )
  nodes.value.splice(
    nodes.value.findIndex((e) => e.id === id),
    1
  )
  console.log('after', nodes.value)
  nodes.value = JSON.parse(JSON.stringify(nodes.value))
}
</script>
