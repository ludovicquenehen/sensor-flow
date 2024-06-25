<template>
  <div class="dnd-flow" @drop="onDrop">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges" @dragover="onDragOver" @dragleave="onDragLeave">
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease'
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
    </VueFlow>

    <Sidebar />
  </div>
	<div>
		{{ nodes }}
	</div>
	<hr>
	<div>
		{{ edges }}
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

const nodes = ref([])
const edges = ref([])

onConnect(addEdges)
</script>
