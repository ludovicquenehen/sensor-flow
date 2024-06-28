<template>
  <aside>
    <div class="description">You can drag these nodes to the pane.</div>
    <div class="nodes">
      <div
        v-for="item in items"
        :class="`vue-flow__node-default ${item.type}`"
        :draggable="true"
        @dragstart="onDragStart($event, item.type, { ...item })"
      >
        {{ item.label }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import useDragAndDrop from '@/composables/useDnD'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const { onDragStart } = useDragAndDrop()
</script>
