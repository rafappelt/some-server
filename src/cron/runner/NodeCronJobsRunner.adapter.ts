import NodeCron from 'node-cron'
import CronJob from '../domain/CronJob'
import CronJobsRunner from '../domain/CronJobsRunner.service'

export default class NodeCronJobsRunner implements CronJobsRunner {
  start(...jobs: CronJob[]): void {
    for (const job of jobs) {
      NodeCron.schedule(job.cronExpression, () => job.run())
    }
  }

  stop(): void {
    for (const task of NodeCron.getTasks().values()) {
      task.stop()
    }
  }
}
