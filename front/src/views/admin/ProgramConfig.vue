<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Program Config {{ originalProgram?.label }}</div>
    <div class="flex gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <button
            class="button-white w-10 flex justify-center items-center rounded-full"
            @click="addNode('SWITCH')"
          >
            <i :class="`mdi mdi-${HARDWARE_TYPE_ICON['SWITCH']}`" />
          </button>
          <button
            class="button-green w-10 flex justify-center items-center rounded-full"
            @click="save()"
          >
            <i class="mdi mdi-content-save" />
          </button>
        </div>
        <Nested
          v-model:nodes="program"
          v-model:selected="selected"
          v-model:edited="edited"
          :root="true"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { v4 as uuidv4 } from 'uuid'
import Nested from '@/components/draggable/Nested.vue'
import { HARDWARE_TYPE_ICON } from '@/utils/hardwares'
import useProgramStore from '@/stores/use-program-store'
import { onMounted } from 'vue'

const route = useRoute()
const id = computed(() => +route.params.id)
const program = ref([])
const selected = ref(null)
const edited = ref(null)
const addNode = (type) => {
  const id = uuidv4()
  program.value.push({
    id,
    idHardware: null,
    type,
    edit: true,
    children: []
  })
  edited.value = id
}

const originalProgram = computed(() => useProgramStore.programs.find((e) => e.id === id.value))

const save = async () => {
  await useProgramStore.update(id.value, { ...originalProgram.value, program: program.value })
}

const findNested = (nodes, key, value) => {
  let find = nodes.find((e) => e[key] === value)
  if (find) {
    return find
  }

  return nodes
    .map((e) => {
      if (e.children) {
        return findNested(e.children, key, value)
      }
    })
    .filter(Boolean)[0]
}

onMounted(() => {
  program.value = originalProgram.value?.program || []
})
</script>

<style scoped></style>
