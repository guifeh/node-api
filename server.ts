import fastify from "fastify"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { createCoursesRoute } from "./src/routes/create-course.ts"
import { getCoursesRoute } from "./src/routes/get-courses.ts"
import { getCoursesByIdRoute } from "./src/routes/get-course-by-id.ts"
import { editCoursesRoute } from "./src/routes/edit-courses.ts"
import { deleteCoursesRoute } from "./src/routes/delete-courses.ts"
import scalarAPIReference from '@scalar/fastify-api-reference'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
}).withTypeProvider<ZodTypeProvider>()

if(process.env.NODE_ENV === 'development'){
    server.register(fastifySwagger, {
    openapi: {
        info:{
            title: 'Desafio Node.js',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})

server.register(scalarAPIReference, {
  routePrefix: '/docs',
})
}

server.register(createCoursesRoute)
server.register(getCoursesRoute)
server.register(getCoursesByIdRoute)
server.register(editCoursesRoute)
server.register(deleteCoursesRoute)

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.listen({ port: 3333}).then(() => {
    console.log('HTTP server running!')
})