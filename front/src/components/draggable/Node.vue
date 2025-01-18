<template>
  <div class="relative flex gap-8 justify-between cursor-pointer">
    <div v-if="addNodeOpen" class="relative w-full h-full">
      <div class="absolute top-1/4 left-1/2">
        <div
          class="relative flex flex-col gap-2 bg-current z-10 px-6 py-4 rounded-lg border border-white/50 shadow-white/10 shadow-lg"
        >
          <div class="relative">
            <button
              class="absolute right-0 button-red w-10 flex justify-center items-center rounded-full"
              @click="addNodeOpen = !addNodeOpen"
            >
              <i class="mdi mdi-close" />
            </button>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap- font-semibold">
                Time mode
                <div class="flex gap-1">
                  <button
                    v-for="timeMode of TIME_MODE"
                    class="button-w w-10 flex justify-center items-center rounded-full"
                    @click="addNode('TIME', { mode: timeMode })"
                  >
                    <i :class="`mdi mdi-${TIME_MODE_ICON[timeMode]}`" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2 font-semibold">
                Logic gates
                <div class="flex gap-1">
                  <button
                    v-for="gate of LOGIC_GATES"
                    class="button-action w-10 flex justify-center items-center rounded-full"
                    @click="addNode(gate)"
                  >
                    <i :class="`mdi mdi-gate-${gate}`" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2 font-semibold">
                Hardware types
                <div class="flex gap-1">
                  <button
                    v-for="hardwareType of HARDWARE_TYPE"
                    class="button-green w-10 flex justify-center items-center rounded-full"
                    @click="addNode(hardwareType)"
                  >
                    <i :class="`mdi mdi-${HARDWARE_TYPE_ICON[hardwareType]}`" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NodeActuator v-if="node.type === 'ACTUATOR'" v-model:node="node" :edit="nodeIsEdited" />
    <NodeSensor v-else-if="node.type === 'SENSOR'" v-model:node="node" :edit="nodeIsEdited" />
    <NodeSwitch v-else-if="node.type === 'SWITCH'" v-model:node="node" :edit="nodeIsEdited" />
    <NodeTime v-else-if="node.type === 'TIME'" v-model:node="node" :edit="nodeIsEdited" />
    <NodeLogicGate v-else v-model:node="node" :edit="nodeIsEdited" />
    <div
      v-if="selected === node.id || nodeIsEdited"
      class="absolute bottom-12 left-36 bg-current p-4 z-10 border border-1 border-white/50 rounded shadow-white/10 shadow-lg flex gap-2"
    >
      <button
        v-if="node.type !== 'SENSOR'"
        :disabled="nodeIsEdited"
        class="button-green w-10 flex justify-center items-center"
        @click="addNodeOpen = !addNodeOpen"
      >
        <i class="mdi mdi-plus" />
      </button>
      <button
        v-if="!nodeIsEdited"
        class="button-white w-10 flex justify-center items-center"
        @click="handleEdit"
      >
        <i class="mdi mdi-pencil" />
      </button>
      <button v-else class="button-green w-10 flex justify-center items-center" @click="handleSave">
        <i class="mdi mdi-check" />
      </button>
      <button
        :disabled="nodeIsEdited"
        class="button-red w-10 flex justify-center items-center"
        @click="removeNode"
      >
        <i class="mdi mdi-delete" />
      </button>
      <div class="relative">
        <div class="absolute top-[-16px] right-[-12px]">
          <i class="mdi mdi-close" @click="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import useAppStore from '@/stores/use-app-store'
import NodeActuator from '@/components/draggable/nodes/Actuator.vue'
import NodeSensor from '@/components/draggable/nodes/Sensor.vue'
import NodeLogicGate from '@/components/draggable/nodes/LogicGate.vue'
import NodeSwitch from '@/components/draggable/nodes/Switch.vue'
import NodeTime from '@/components/draggable/nodes/Time.vue'
import { LOGIC_GATES } from '@/utils/gates'
import { HARDWARE_TYPE, HARDWARE_TYPE_ICON } from '@/utils/hardwares'
import { LOGIC_OPERATORS, LOGIC_OPERATORS_ICON } from '@/utils/operators'
import { TIME_MODE, TIME_MODE_ICON } from '@/utils/time-mode'

const emit = defineEmits(['removeNode'])

const node = defineModel('node')
const selected = defineModel('selected')
const edited = defineModel('edited')
const nodeIsEdited = computed(() => edited.value === node.value.id)

const close = () => {
  edited.value = null
  node.value.edit = false
  addNodeOpen.value = false
}

const handleEdit = () => {
  if (edited.value === node.value.id) {
    edited.value = null
    node.value.edit = false
  } else {
    edited.value = node.value.id
    node.value.edit = true
  }
}

const handleSave = () => {
  edited.value = null
}

const addNodeOpen = ref(false)
const addNode = (type = 'SENSOR', merge = {}) => {
  const id = uuidv4()
  node.value.children.push({
    id,
    type,
    children: [],
    ...merge
  })
  addNodeOpen.value = false
}

const removeNode = () => {
  emit('removeNode', node.value.id)
}
</script>
