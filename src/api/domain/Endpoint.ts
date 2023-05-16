import EndpointRequest from './EndpointRequest'
import EndpointResponse from './EndpointResponse'

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default abstract class Endpoint {
  abstract process(request: EndpointRequest): Promise<EndpointResponse<any>>
}
