import {Server} from '@hapi/hapi'
import {getSettingsValues, setSettingsValue, verifySettingsPage} from "./api-caller";
import Joi from "joi";

export default async function API(server: Server) {
  const params = (obj: Record<string, Joi.Schema> = {}) => Joi.object({
    host: Joi.string().required().alphanum().max(63).min(2),
    page: Joi.string().required().alphanum().max(10).min(2),
    ...obj
  })

  server.route({
    method: 'GET',
    path: `/api/{host}/settings/{page}`,
    handler: async (request, h) => {
      await verifySettingsPage(request.params.host, request.params.page)

      return getSettingsValues(request.params.host, request.params.page)
    },
    options: {
      validate: {
        params: params()
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/api/{host}/settings/{page}/set/{key}/{value}',
    handler: async (request, h) => {
      await verifySettingsPage(request.params.host, request.params.page)

      await setSettingsValue(request.params.host, request.params.page, request.params.key, request.params.value)

      return {
        ok: true
      }
    }
  })
}
