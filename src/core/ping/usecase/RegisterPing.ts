import StateRepository from '../../state/domain/State.repository'

export default class RegisterPing {
  constructor(protected stateRepository: StateRepository<string>) {
    //
  }

  execute() {
    this.stateRepository.setState('lastPing', new Date().toLocaleString())
  }
}
