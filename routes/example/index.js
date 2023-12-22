'use strict'

const { S } = require('fluent-json-schema')

const BadRequestSchema = S.object()
  .prop('statusCode', S.number())
  .prop('code', S.string())
  .prop('error', S.string())
  .prop('message', S.string())

const InternalServerErrorSchema = S.object()
  .prop('statusCode', S.number())
  .prop('error', S.string())
  .prop('message', S.string())

const NotFoundSchema = S.object()
  .prop('statusCode', S.number())
  .prop('error', S.string())
  .prop('message', S.string())


module.exports = async function (fastify, opts) {
  fastify.post(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: BadRequestSchema.valueOf(),
              },
            },
          },
          404: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: NotFoundSchema.valueOf(),
                example: {
                  statusCode: 404,
                  error: 'Not Found',
                  message: 'Not Found',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: InternalServerErrorSchema.valueOf(),
                example: {
                  message: 'Internal Server Error',
                },
              },
            },
          }
        }
      }
    },
    async function (request, reply) {
      if (request.params.id === '1') {
        return reply.notFound()
      }
    }
  )
}
