import {Server} from '@hapi/hapi'
import {getSettingsValues, setSettingsValue, verifySettingsPage} from "./api-caller.js";
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
      await verifySettingsPage(request.params.host as string, request.params.page as string)

      return getSettingsValues(request.params.host as string, request.params.page as string)
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
      await verifySettingsPage(request.params.host as string, request.params.page as string)

      await setSettingsValue(request.params.host as string, request.params.page as string, request.params.key as string, request.params.value as string)

      return {
        ok: true
      }
    }
  })
}
