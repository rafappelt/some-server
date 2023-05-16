import StateRepository from '../domain/State.repository'

export default class GetState<T> {
  constructor(protected repository: StateRepository<T>) {
    //
  }

  async execute(key: string): Promise<T | undefined> {
    return this.repository.getState(key)
  }
}
