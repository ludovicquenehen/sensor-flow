import { api } from '@/plugins/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

export default reactive({
  projects: [],
  runs: [],
  async fetch(force = false) {
    if (this.projects.length === 0 || force) {
      try {
        this.projects = (await api.get('/project'))?.data || []
				this.runs = (await api.get('/run'))?.data || []
      } catch (err) {
        toast.error('Projects fetch error')
      }
    }
  },
  async add(user) {
    try {
      if (await api.put('/project', { ...user })) toast.success('Project added successfully')
      await this.fetch(true)
    } catch {
      toast.error('Add project error')
    }
  },
  async remove(projectId) {
    try {
      if (await api.delete(`/project/${projectId}`)) toast.success('Project removed successfully')
      await this.fetch(true)
    } catch {
      toast.error('Remove project error')
    }
  },
  async archive(project, version) {
    try {
      if (await api.get(`project/${project}/archive/${version}`))
        toast.success('Project archived successfully')
      await this.fetch(true)
    } catch (err) {
      toast.error('Archive project version error')
    }
  },
  async unarchive(project, version) {
    try {
      if (await api.get(`/project/${project}/unarchive/${version}`))
        toast.success('Project unarchived successfully')
      await this.fetch(true)
    } catch {
      toast.error('Unarchive project version error')
    }
  },
  async run(projectId) {
    try {
      if (await api.get(`/run/${projectId}/start`)) toast.success('Project start successfully')
      await this.fetch(true)
    } catch {
      toast.error('Start project error')
    }
  },
  async stop(projectId) {
    try {
      if (await api.get(`/run/${projectId}/stop`)) toast.success('Project stop successfully')
      await this.fetch(true)
    } catch {
      toast.error('Stop project error')
    }
  }
})
