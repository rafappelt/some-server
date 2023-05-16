import Route from './api/domain/Route'
import ApiServer from './api/domain/ApiServer'
import Configuration, { GoogleIdentityConfiguration } from './Configuration'
import CronJob from './cron/domain/CronJob'
import CronJobsRunner from './cron/domain/CronJobsRunner.service'
import SomeServer from './SomeServer'

class TestConfig implements Configuration {
  constructor(public apiServer: ApiServer, public cronJobsRunner: CronJobsRunner) {
    //
  }

  apiPort: number = 0
  apiBasePath: string = ''
  routes: Route[] = []
  cronJobs: CronJob[] = []
  softwares = []
  startupHook = jest.fn(async () => { })
  shutdownHook = jest.fn(async () => { })
  googleIdentity: GoogleIdentityConfiguration = {
    clientId: '',
    clientSecret: ''
  }
}

class MockedApiServer implements ApiServer {
  constructor(protected errorOnStart: boolean = false, protected errorOnStop: boolean = false) {
    //
  }

  async start(port: number, basePath: string, routes: Route[]): Promise<void> {
    if (this.errorOnStart) {
      throw new Error('Api Server: forced startup error')
    }
  }

  async stop(): Promise<void> {
    if (this.errorOnStop) {
      throw new Error('Api Server: forced stopping error')
    }
  }
}

class MockedCronJobRunner implements CronJobsRunner {
  constructor(protected errorOnStart: boolean = false, protected errorOnStop: boolean = false) {
    //
  }

  start(...jobs: CronJob[]): void {
    if (this.errorOnStart) {
      throw new Error('Cron Job Runner: forced startup error')
    }
  }

  stop(): void {
    if (this.errorOnStop) {
      throw new Error('Cron Job Runner: forced stopping error')
    }
  }
}

describe('Some Server clean startup', () => {
  const apiServer = new MockedApiServer()
  const cronJobRunner = new MockedCronJobRunner()
  const config = new TestConfig(apiServer, cronJobRunner)
  const server = new SomeServer(config)

  it('Calls startup hook before the server starts', async () => {
    expect(config.startupHook).toBeCalledTimes(0)
    await server.start()
    expect(config.startupHook).toBeCalledTimes(1)
  })

  it('Calls startup hook after the server stops', async () => {
    expect(config.shutdownHook).toBeCalledTimes(0)
    await server.stop()
    expect(config.shutdownHook).toBeCalledTimes(1)
  })
})

describe('Some Server fail on startup', () => {
  const apiServer = new MockedApiServer(true)
  const cronJobRunner = new MockedCronJobRunner()
  const config = new TestConfig(apiServer, cronJobRunner)
  const server = new SomeServer(config)

  it('Calls startup hook', async () => {
    try {
      await server.start()
    } catch (error) { }
    expect(config.startupHook).toBeCalledTimes(1)
  })

  it('Calls shutdown hook', async () => {
    try {
      await server.start()
    } catch (error) { }
    expect(config.shutdownHook).toBeCalledTimes(1)
  })
})

describe('Some Server fail on shutdown', () => {
  const apiServer = new MockedApiServer(false, true)
  const cronJobRunner = new MockedCronJobRunner(false, true)
  const config = new TestConfig(apiServer, cronJobRunner)
  const server = new SomeServer(config)

  it('Calls shutdown hook', async () => {
    try {
      await server.start()
      expect(config.shutdownHook).toBeCalledTimes(0)
      await server.stop()
    } catch (error) { }
    expect(config.shutdownHook).toBeCalledTimes(1)
  })
})
