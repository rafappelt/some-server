import Endpoint from './Endpoint'
import EndpointRequest from './EndpointRequest'
import EndpointResponse from './EndpointResponse'

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default class Route {
  constructor(protected _method: Method, protected _path: string, protected endpoint: Endpoint) {
    //
  }

  async process(request: EndpointRequest): Promise<EndpointResponse<any>> {
    return this.endpoint.process(request)
  }

  get path(): string {
    return this._path
  }

  get method(): Method {
    return this._method
  }
}

export function GET(path: string, endpoint: Endpoint) {
  return new Route('get', path, endpoint)
}

export function POST(path: string, endpoint: Endpoint) {
  return new Route('post', path, endpoint)
}
