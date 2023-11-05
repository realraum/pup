import Hapi from '@hapi/hapi'

import converter from './swagger2openapi'

import API from './api'

async function require(thing: string) {
  const imported = await import(thing) // "dynamic import"
  return Object.assign(imported.default, imported)
}

export default async (config: any) => {
  const Relish = (await require('relish2'))({
    messages: {}
  })

  config.hapi.routes = {
    validate: {
      failAction: Relish.failAction
    }
  }

  const server = Hapi.server(config.hapi)

  await server.register({
    plugin: await require('@hapi/inert')
  })

  await server.register({
    plugin: await require('@hapi/vision')
  })

  await server.register({
    plugin: await require('hapi-pino'),
    options: {
      name: 'pup'
    }
  })

  await server.register({
    plugin: await require('hapi-swagger'),
    options: {
      info: {
        title: 'Pup',
        version: 'the best'
      },
      produces: ['application/json'],
      consumes: ['application/json']
    }
  })

  server.route({
    method: 'GET',
    path: '/swagger3.json',
    handler: async function(request) {
      const res = await server.inject('/swagger.json')
      const converted = await converter(JSON.parse(res.payload))

      if (request.headers['x-forwarded-for']) {
        converted.servers = [
          {
            url: (request.headers['x-forwarded-proto'] ?? 'http') + '://' + request.info.hostname
          }
        ]
      }

      return converted
    }
  })

  if (process.env.SENTRY) {
    await server.register({
      plugin: await require('hapi-sentry'),
      options: { client: process.env.SENTRY }
    })
  }

  await API(server)

  return {
    server,
    async start() {
      await server.start()
    },
    async stop() {
      await server.stop()
    }
  }
}
