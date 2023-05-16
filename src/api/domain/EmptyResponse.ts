import EndpointResponse from './EndpointResponse'

export default class EmptyResponse implements EndpointResponse<{}> {
  body: {} = {}
  status:number = 204
}
