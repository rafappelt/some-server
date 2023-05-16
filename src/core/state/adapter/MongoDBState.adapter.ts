import MongoDBAdapter from '../../common/adapter/MongoDB.adapter'
import State from '../domain/State.entity'
import StateRepository from '../domain/State.repository'

const STATUS_COLLECTION_NAME = 'status'

export default class MongoDBStateRepository extends MongoDBAdapter implements StateRepository<string> {
  async setState(key: string, value: string): Promise<void> {
    const collection = this.mongoDB.collection<State<string>>(STATUS_COLLECTION_NAME)
    const filter = { key }
    const update = { $set: { value } }
    const options = { upsert: true }
    await collection.updateOne(filter, update, options)
  }

  async getState(key: string): Promise<string | undefined> {
    const collection = this.mongoDB.collection<State<string>>(STATUS_COLLECTION_NAME)
    const result = await collection.findOne({ key })

    if (!result) {
      return undefined
    }

    return result.value
  }
}
