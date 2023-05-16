import CronJob from './CronJob'

export default interface CronJobsRunner {
  start(...jobs: CronJob[]): void
  stop(): void
}
