import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'
import { eq } from 'drizzle-orm'

export const editCoursesRoute:FastifyPluginAsyncZod = async (server) => {
   server.put('/courses/:id',{
    schema:{
        params: z.object({
            id: z.uuid()
        }),
        body: z.object({
            title: z.string()
        }),
        tags: ['courses'],
        summary: 'Edit courses',
        response:{
            200: z.object({
                course: z.object({
                    id: z.uuid(),
                    title: z.string(),
                    description: z.string().nullable(),
                })
            }),
            404: z.null().describe('Course not found')
        },
    }
   } ,async (request, reply) =>{
       const courseId = request.params.id
       const courseTitle = request.body.title

       const result = await db
           .select()
           .from(courses)
           .where(eq(courses.id, courseId))
       
       const edit = await db
           .update(courses)
           .set({ title: courseTitle})
           .where(eq(courses.id, courseId))
           .returning()
   
       return reply.status(200).send({ course: edit[0] })
   })
}