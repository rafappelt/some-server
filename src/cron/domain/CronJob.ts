import Task from './Task'

export default class CronJob {
  constructor(public readonly cronExpression: string, protected task: Task) {
    //
  }

  run() {
    this.task.run()
  }
}
