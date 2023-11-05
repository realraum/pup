#!/usr/bin/env node

import Webserver from './webserver'

const webserver = await Webserver({
  hapi: {
    port: 3344
  }
})

await webserver.start()

process.on('SIGINT', () => webserver.stop())
process.on('SIGTERM', () => webserver.stop())
