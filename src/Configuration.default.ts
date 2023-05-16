import Configuration, { GoogleIdentityConfiguration } from './Configuration'
import ApiServer from './api/domain/ApiServer'
import Route, { GET } from './api/domain/Route'

import GetPingEndpoint from './api/endpoint/ping/GetPing.endpoint'

import ExpressServer from './api/server/ExpressServer'
import ExpressMiddleware from './api/server/middleware/ExpressMiddleware'
import GoogleAuthChecker from './api/server/middleware/GoogleAuthChecker'
import GetLastPing from './core/ping/usecase/GetLastPing'
import RegisterPing from './core/ping/usecase/RegisterPing'
import InMemoryStateRepository from './core/state/adapter/InMemoryState.adapter'
import CronJob from './cron/domain/CronJob'
import CronJobsRunnerService from './cron/domain/CronJobsRunner.service'
import NodeCronJobsRunner from './cron/runner/NodeCronJobsRunner.adapter'
import ExampleTask from './cron/task/Example.task'

/**
 * Cron Jobs Runner
 */
const cronJobsRunner: CronJobsRunnerService = new NodeCronJobsRunner()

/**
 * API port
 */
const DEFAULT_PORT = 3000
const apiPort: number = Number(process.env.SERVER_PORT || DEFAULT_PORT)

/**
 * API base path
 */
const DEFAULT_BASE_PATH = '/api'
const apiBasePath: string = process.env.SERVER_BASE_PATH || DEFAULT_BASE_PATH

/**
 * OAuth
 */
const oAuth = process.env.OAUTH || 'header'
if (oAuth !== 'enabled' && oAuth !== 'disabled' && oAuth !== 'header') {
  throw Error(`Invalid oAuth configuration value: ${oAuth}`)
}

/**
 * Google Identity Authentication
 */
const googleIdentity: GoogleIdentityConfiguration = {
  clientId: process.env.GOOGLE_ID_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_ID_CLIENT_SECRET || ''
}

/**
 * API Server Middlewares
 */
const middlewares: ExpressMiddleware[] = [
  new GoogleAuthChecker(oAuth, googleIdentity.clientId, googleIdentity.clientSecret)
]

/**
 * API Server
 */
const apiServer: ApiServer = new ExpressServer(middlewares)

/**
 * Startup hook
 */
const startupHook = async (): Promise<void> => {
  // try {
  //   await MongoDB.connect()
  // } catch (error) {
  //   process.exit(1)
  // }
}

/**
 * Shutdown hook
 */
const shutdownHook = async (): Promise<void> => {
  // MongoDB.disconnect()
}

/**
 * Services '_'
 */
const _ = {
  stateRepository: new InMemoryStateRepository<string>()
}

/**
 * Use Cases
 */
const uc = {
  registerPing: new RegisterPing(_.stateRepository),
  getLastPing: new GetLastPing(_.stateRepository)
}

/**
 * API Endpoints Routes
 */
const routes: Route[] = [
  GET('/', new GetPingEndpoint(uc.registerPing, uc.getLastPing))
]

/**
 * Cron Jobs
 */
const cronJobs: CronJob[] = [
  // Run Example every minute
  new CronJob('*/1 * * * *', new ExampleTask())
]

export default class DefaultConfiguration implements Configuration {
  readonly googleIdentity: GoogleIdentityConfiguration = googleIdentity
  readonly apiServer: ApiServer = apiServer
  readonly routes: Route[] = routes
  readonly cronJobsRunner: CronJobsRunnerService = cronJobsRunner
  readonly cronJobs: CronJob[] = cronJobs
  readonly apiPort: number = apiPort
  readonly apiBasePath: string = apiBasePath
  startupHook = startupHook
  shutdownHook = shutdownHook
}
