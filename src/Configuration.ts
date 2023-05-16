import ApiServer from './api/domain/ApiServer'
import Route from './api/domain/Route'
import CronJob from './cron/domain/CronJob'
import CronJobsRunner from './cron/domain/CronJobsRunner.service'

export default interface Configuration {
  apiServer: ApiServer
  apiPort: number
  apiBasePath: string
  routes: Route[]
  cronJobsRunner: CronJobsRunner
  cronJobs: CronJob[]
  startupHook?: () => Promise<void>
  shutdownHook?: () => Promise<void>
  googleIdentity: GoogleIdentityConfiguration,
}

export interface GoogleIdentityConfiguration {
  clientId: string
  clientSecret: string
}
