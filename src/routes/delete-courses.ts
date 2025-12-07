import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'
import { eq } from 'drizzle-orm'

export const deleteCoursesRoute:FastifyPluginAsyncZod = async (server) => {
   server.delete('/courses/:id', {
    schema:{
        params: z.object({
            id: z.uuid()
        }),
        tags: ['courses'],
        summary: 'Delete courses',
        response:{
            200: z.object({
                message: z.string()
            }),
            404: z.null().describe('Course not found')
        },
    }
   },async (request, reply) => {
    const courseId = request.params.id

    const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))

    const deleted = await db
        .delete(courses)
        .where(eq(courses.id, courseId))


    return reply.status(200).send({ message: 'Curso excluido com sucesso!' })

})
}