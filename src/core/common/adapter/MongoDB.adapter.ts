import mongo, { MongoDBInstance } from '../../../helper/mongodb/MongoDB'

export default class MongoDBAdapter {
  constructor(protected mongoDB: MongoDBInstance = mongo) {
    //
  }
}
