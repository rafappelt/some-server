import Route from './Route'

export default interface ApiServer {
  start(port: number, basePath: string, routes: Route[]): Promise<void>
  stop(): Promise<void>
}
