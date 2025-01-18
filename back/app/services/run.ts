import Project from '#models/project'
import { spawn } from 'child_process'

export const runs: Array<{
  organizationId: string
  projectId: string
  instance: any
  since: number
}> = []

export default class RunService {
  static async start(organizationId: string, projectId: string) {
    const project = await Project.query()
      .where('organizationId', organizationId)
      .andWhere('id', projectId)
      .firstOrFail()

    const instance = spawn('node', ['../scheduler/index.js', organizationId, projectId])
    instance.stdout.on('data', (data) => {
      console.log(`[LOG - ${project.label}]: ${data.toString()}`)
    })

    instance.stderr.on('data', (data) => {
      console.error(`[ERROR - ${project.label}]: ${data.toString()}`)
    })
    instance.on('exit', (code) => {
      const index = runs.findIndex((e) => e.instance.pid === instance.pid)
      if (index >= 0) {
        runs.splice(index, 1)
      }
			console.error(`[FATAL ERROR - ${project.label} - Code ${code}]`)
    })
    runs.push({ organizationId, projectId, instance, since: Date.now() })
  }

  static stop(organizationId: string, projectId: string) {
    const index = runs.findIndex(
      (e) => e.organizationId === organizationId && e.projectId === projectId
    )
    if (index >= 0) {
      process.kill(runs[index].instance.pid)
      runs.splice(index, 1)
    }
  }
}
