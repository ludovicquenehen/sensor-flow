import { api } from '@/plugins/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export default reactive({
  hardwares: [],
  async fetch(force = false) {
    if (this.hardwares.length === 0 || force) {
      try {
        this.hardwares = (await api.get('/hardware'))?.data || []
      } catch (err) {
        toast.error('Hardwares fetch error')
      }
    }
  },
  async add(hardware) {
    try {
      if (await api.put('/hardware', { ...hardware })) toast.success('Hardware added successfully')
      await this.fetch(true)
    } catch {
      toast.error('Add hardware error')
    }
  },
  async update(hardwareId, hardware) {
    try {
      if (await api.post(`/hardware/${hardwareId}`, { ...hardware })) toast.success('Hardware updated successfully')
      await this.fetch(true)
    } catch {
      toast.error('Upate hardware error')
    }
  },
  async remove(hardwareId) {
    try {
      if (await api.delete(`/hardware/${hardwareId}`))
        toast.success('Hardware removed successfully')
      await this.fetch(true)
    } catch {
      toast.error('Remove hardware error')
    }
  }
})
