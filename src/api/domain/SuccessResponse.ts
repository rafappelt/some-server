import OKResponse from './OKResponse'

export default class SuccessResponse<T> extends OKResponse<{
  success: boolean,
  data: T
}> {
  constructor(public data: T) {
    super({
      success: true,
      data
    })
  }
}
