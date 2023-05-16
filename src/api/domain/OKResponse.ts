import EndpointResponse from './EndpointResponse'

export default class OKResponse<T> implements EndpointResponse<T> {
  status:number = 200
  constructor(public body: T) {
    //
  }
}
