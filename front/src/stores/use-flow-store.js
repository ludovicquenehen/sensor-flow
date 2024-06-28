import { api } from '@/plugins/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export default reactive({
  flows: [],
  async fetch(force = false) {
    if (this.flows.length === 0 || force) {
      try {
        this.flows = (await api.get('/flow'))?.data || []
      } catch (err) {
        toast.error('flows fetch error')
      }
    }
  },
  async add(flow) {
    try {
      if (await api.put('/flow', { ...flow })) toast.success('Flow added successfully')
      await this.fetch(true)
    } catch {
      toast.error('Add flow error')
    }
  },
  async update(flowId, flow) {
    try {
      if (await api.post(`/flow/${flowId}`, { ...flow })) toast.success('Flow updated successfully')
      await this.fetch(true)
    } catch {
      toast.error('Upate flow error')
    }
  },
  async remove(flowId) {
    try {
      if (await api.delete(`/flow/${flowId}`))
        toast.success('Flow removed successfully')
      await this.fetch(true)
    } catch {
      toast.error('Remove flow error')
    }
  }
})
