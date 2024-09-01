import { api } from '@/plugins/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export default reactive({
  cycles: [],
  async fetch(force = false) {
    if (this.cycles.length === 0 || force) {
      try {
        this.cycles = (await api.get('/cycle'))?.data || []
      } catch (err) {
        toast.error('Cycles fetch error')
      }
    }
  },
  async add(cycle) {
    try {
      if (await api.put('/cycle', { ...cycle })) toast.success('Cycle added successfully')
      await this.fetch(true)
    } catch {
      toast.error('Add cycle error')
    }
  },
  async update(cycleId, cycle) {
    try {
      if (await api.post(`/cycle/${cycleId}`, { ...cycle })) toast.success('Cycle updated successfully')
      await this.fetch(true)
    } catch {
      toast.error('Upate cycle error')
    }
  },
  async remove(cycleId) {
    try {
      if (await api.delete(`/cycle/${cycleId}`))
        toast.success('Cycle removed successfully')
      await this.fetch(true)
    } catch {
      toast.error('Remove cycle error')
    }
  }
})
