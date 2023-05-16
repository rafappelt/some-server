import StateRepository from '../domain/State.repository'

export default class SetState<T> {
  constructor(protected repository: StateRepository<T>) {
    //
  }

  async execute(key: string, value: T) {
    return this.repository.setState(key, value)
  }
}
