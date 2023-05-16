import GetLastPing from '../../../core/ping/usecase/GetLastPing'
import RegisterPing from '../../../core/ping/usecase/RegisterPing'
import Endpoint from '../../domain/Endpoint'
import EndpointRequest from '../../domain/EndpointRequest'
import EndpointResponse from '../../domain/EndpointResponse'
import OKResponse from '../../domain/OKResponse'

export default class GetPingEndpoint extends Endpoint {
  constructor(protected registerPing: RegisterPing, protected getLastPing: GetLastPing) {
    super()
  }

  async process(request: EndpointRequest): Promise<EndpointResponse<String>> {
    const lastPing = await this.getLastPing.execute()
    this.registerPing.execute()
    if (!lastPing) {
      return new OKResponse('This is the first ping')
    }
    return new OKResponse(`Last ping was ${lastPing}`)
  }
}
