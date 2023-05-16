import Configuration from './Configuration'
import DefaultConfiguration from './Configuration.default'
import SomeServer from './SomeServer'

const config: Configuration = new DefaultConfiguration()

new SomeServer(config).start().then(() => {
  console.log('Some Server sucessfully initialized')
})
