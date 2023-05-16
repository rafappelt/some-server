import Configuration from './Configuration'

export default class SomeServer {
  constructor(protected config: Configuration) {
    //
  }

  async start() {
    console.log('Some Server startup...')
    try {
      if (this.config.startupHook) {
        await this.config.startupHook()
      }
      await this.startApiServer()
      await this.scheduleCronJobs()
      this.bindOSTerminationSignals()
    } catch (startupError) {
      try {
        await this.shutdown()
      } catch (shutdownError) {}
      throw startupError
    }
  }

  async stop() {
    await this.shutdown()
  }

  protected async startApiServer(): Promise<void> {
    console.log(`Starting Api Server on port ${this.config.apiPort}...`)
    await this.config.apiServer.start(Number(this.config.apiPort), this.config.apiBasePath, this.config.routes)
    console.log(`Api Server running on port ${this.config.apiPort}`)
  }

  protected async stopApiServer(): Promise<void> {
    await this.config.apiServer.stop()
  }

  protected async scheduleCronJobs() {
    this.config.cronJobsRunner.start(...this.config.cronJobs)
  }

  protected bindOSTerminationSignals() {
    process.on('SIGTERM', () => this.shutdown())
    process.on('SIGINT', () => this.shutdown())
  }

  protected async shutdown() {
    console.log('Some Server shutdown...')
    try {
      await this.stopApiServer()
    } catch (error) {
      console.log('Error stopping API server')
      console.log(error)
    }
    try {
      await this.stopCronJobs()
    } catch (error) {
      console.log('Error stopping Cron Jobs Runner')
      console.log(error)
    }
    if (this.config.shutdownHook) {
      await this.config.shutdownHook()
    }
    console.log('Some Server - Shutdown completed')
  }

  protected async stopCronJobs() {
    this.config.cronJobsRunner.stop()
  }
}
