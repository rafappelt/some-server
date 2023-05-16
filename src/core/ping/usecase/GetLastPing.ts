import StateRepository from '../../state/domain/State.repository'

export default class GetLastPing {
  constructor(protected stateRepository: StateRepository<string>) {
    //
  }

  async execute(): Promise<string | undefined> {
    return this.stateRepository.getState('lastPing')
  }
}
