import { MongoClient, Db, Collection, Document, Filter, AggregateOptions, FindCursor } from 'mongodb'
export class MongoDBInstance {
  protected client?: MongoClient

  constructor(protected config: MongoDBConfig) {
    //
  }

  protected get url() {
    return `mongodb://${this.config.username}:${this.config.password}@${this.config.ip}/?authSource=${this.config.dbName}&w=1`
  }

  protected get db(): Db {
    if (!this.client) {
      throw Error('MongoDB is disconnected. Use the `connect` method')
    }
    return this.client.db(this.config.dbName)
  }

  collection<T extends Document = Document>(collectionName: string): Collection<T> {
    if (!this.client) {
      throw Error('MongoDB is disconnected. Use the `connect` method')
    }
    return this.db.collection<T>(collectionName)
  }

  /**
   * called to obtain all values in a collection
   * will probably be changed to search for a certain value
   */
  findDocuments<T extends Document = Document>(collectionName: string, filter?: Filter<Document>): Promise<T[]> {
    if (!this.client) {
      throw Error('MongoDB is disconnected. Use the `connect` method')
    }
    const documentCursor: FindCursor<T> = this.collection(collectionName).find<T>(filter || {})
    return documentCursor.toArray()
  }

  agregate<T extends Document = Document>(collectionName: string, pipeline?: Document[], options?: AggregateOptions): Promise<T[]> {
    return this.collection<T>(collectionName).aggregate<T>(pipeline, options).toArray()
  }

  /**
   * Creates a connection to the database
   */
  async connect(): Promise<void> {
    try {
      console.log(`Connecting MongoDB ${this.config.dbName} on ${this.config.ip}`)
      this.client = await MongoClient.connect(this.url)
    } catch (error) {
      console.log('Fail on Database connection.')
      console.error(error)
      throw error
    }
    console.log('Database connected successfully.')
  }

  isConnected() : boolean {
    return this.client !== undefined
  }

  /**
   * Closes connection to the database
   */
  disconnect() {
    if (this.client) {
      this.client.close()
      this.client = undefined
    }
  }
}

export interface MongoDBConfig {
  username: string,
  password: string,
  ip: string,
  dbName: string
}

export default new MongoDBInstance({
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  ip: process.env.DB_IP!,
  dbName: process.env.DB_NAME!
})
