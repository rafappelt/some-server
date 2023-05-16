export default interface StateRepository<T> {
  setState(key: string, value: T): Promise<void>
  getState(key: string): Promise<T | undefined>
}
