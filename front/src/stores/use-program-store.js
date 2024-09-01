import { api } from '@/plugins/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export default reactive({
  programs: [],
  async fetch(force = false) {
    if (this.programs.length === 0 || force) {
      try {
        this.programs = (await api.get('/program'))?.data || []
      } catch (err) {
        toast.error('Programs fetch error')
      }
    }
  },
  async add(program) {
    try {
      if (await api.put('/program', { ...program })) toast.success('Program added successfully')
      await this.fetch(true)
    } catch {
      toast.error('Add program error')
    }
  },
  async update(programId, program) {
    try {
      if (await api.post(`/program/${programId}`, { ...program })) toast.success('Program updated successfully')
      await this.fetch(true)
    } catch {
      toast.error('Upate program error')
    }
  },
  async remove(programId) {
    try {
      if (await api.delete(`/program/${programId}`))
        toast.success('Program removed successfully')
      await this.fetch(true)
    } catch {
      toast.error('Remove program error')
    }
  }
})
