import cors from 'cors'
import express, { Express, Request, Response, Router } from 'express'
import http from 'http'
import ExpressServerHelper from '../../helper/express/ExpressServerHelper'
import EndpointRequest from '../domain/EndpointRequest'
import Route from '../domain/Route'
import ApiServer from '../domain/ApiServer'
import ExpressMiddleware from './middleware/ExpressMiddleware'

/**
 * Express Server
 * The application entry point where the API is served.
 * The endpoints are defined in the Configuration module
 * @see Configuration
 */
export default class ExpressServer implements ApiServer {
  expressApplication!: Express
  httpServer!: http.Server

  constructor(protected middlewares?: ExpressMiddleware[]) {
    //
  }

  protected init(basePath: string, routes: Route[]) {
    this.expressApplication = this.createExpressApplication(basePath, routes, this.middlewares)
  }

  /**
   * Create and initialize the Express application with its router.
   * The application is configured to parse incoming requests with JSON payloads.
   * @returns The Express application
   */
  protected createExpressApplication(basePath: string, routes: Route[], middlewares?: ExpressMiddleware[]): Express {
    const app = express()

    this.installMiddlewares(app, middlewares)

    app.use(express.urlencoded({ extended: true }))
      .use(cors())
      .use(express.json())
      .use(basePath, this.createRouter(routes))

    return app
  }

  /**
   * Install the middlewares in the given Express application
   */
  protected installMiddlewares(app: Express, middlewares?: ExpressMiddleware[]) {
    if (middlewares) {
      for (const middleware of middlewares) {
        app.use(middleware.process.bind(middleware))
      }
    }
  }

  /**
   * Create and initialize a router with the endpoints defined in the Configuration module.
   * @see Configuration
   */
  protected createRouter(routes: Route[]): Router {
    const router = Router()
    this.installRoutes(routes, router)
    return router
  }

  /**
   * Install de endpoints defined in the Configuration module on the Express router
   * @param routes the endpoints routes to be installed
   * @param router the router where the endpoints will be installed
   */
  protected installRoutes(routes: Route[], router: Router) {
    routes.map(
      endpoint =>
        router[endpoint.method](
          endpoint.path,
          async (request: Request, response: Response) =>
            this.handleEndpointCall(endpoint, request, response)
        )
    )
  }

  /**
   * Call an api endpoint given an Express request and response
   * @param route The endpoint route to be processed
   * @param request The client's request provided by the Express Framework
   * @param response The Express response object where the endpoint response will be delivered
   */
  protected async handleEndpointCall(route: Route, request: Request, response: Response) {
    try {
      const endpointResponse = await route.process(this.buildEndpointRequest(request))
      response.json(endpointResponse.body).status(endpointResponse.status)
    } catch (error) {
      this.handleEndpointError(error, request, response)
    }
  }

  /**
   * Build an EndpointRequest based on the client request provided by the Express Framework
   * @param request The client's request provided by the Express Framework
   * @returns An EndpointRequest with the client's params, headers, body, url and ip.
   */
  protected buildEndpointRequest(request: Request): EndpointRequest {
    return {
      body: request.body,
      headers: request.headers,
      params: request.params,
      url: request.url,
      query: request.query,
      ip: ExpressServerHelper.extractClientIP(request)
    }
  }

  /**
   * Handle unexpected errors that occurred during the endpoint execution.
   * Creates a response with the error message as body and the HTTP
   * Status 500(Internal Server Error)
   * @param error The given error
   * @param request The client's request provided by the Express Framework
   * @param response The Express response object where the error will be delivered
   */
  protected handleEndpointError(error: any, request: Request, response: Response) {
    response.status(error.httpStatusCode || 500).send({ error: error.message || 'Internal server error' })
  }

  /**
   * Start the Express Server
   */
  public start(port: number, basePath: string, routes: Route[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.init(basePath, routes)
      this.httpServer = this.expressApplication.listen(port, resolve)
    })
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.httpServer = this.httpServer.close((error?: Error | undefined) => {
        if (error) {
          throw error
        }
        resolve()
      })
    })
  }
}
