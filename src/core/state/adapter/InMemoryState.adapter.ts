import StateRepository from '../domain/State.repository'

export default class InMemoryStateRepository<T> implements StateRepository<T> {
  state: Map<string, T> = new Map<string, T>()

  async setState(key: string, value: T): Promise<void> {
    this.state.set(key, value)
  }

  async getState(key: string): Promise<T | undefined> {
    return this.state.get(key)
  }
}
