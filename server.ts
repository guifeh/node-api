import fastify from "fastify"
import crypto from "node:crypto"

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
})

const courses = [
    { id: '1', title: "Curso de Node.js"},
    { id: '2', title: "Curso de React"},
    { id: '3', title: "Curso de React Native"},
]

server.get('/courses', () => {
    return { courses }
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const course = courses.find(course => course.id === courseId)

    if(course){
        return { course }
    }

    return reply.status(404).send()
})

server.put('/courses/:id', (request, reply) =>{
    type Params = {
        id: string
    }

    type Body = {
        title: string
    }
    const params = request.params as Params
    const courseId = params.id

    const body = request.body as Body
    const courseTitle = body.title

    if(!courseId){
        reply.status(404).send({ message: 'Id obrigatório'})
        return
    }

    const course = courses.find(course => course.id === courseId)

    if(!course){
        reply.status(404).send({ message: 'Curso não encontrado'})
        return
    }

    course.title = courseTitle

    return reply.status(200).send({ course })
})

server.delete('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    if(!courseId){
        reply.status(404).send({ message: 'Id obrigatório'})
        return
    }

    const course = courses.findIndex(course => course.id === courseId)

    if(course === -1){
        reply.status(404).send({ message: 'Curso não encontrado'})
        return
    }

    courses.splice(course, 1)

    return reply.status(200).send({ message: 'Curso excluido com sucesso!' })

})

server.post('/courses', (request, reply) =>{
    type Body = {
        title: string
    }

    const body = request.body as Body
    const courseTitle = body.title

    const courseId = crypto.randomUUID()

    courses.push({ id: courseId, title: courseTitle })

    if(!courseTitle){
        reply.status(418).send({ message: 'Titulo obrigatório'})
    }

    return reply.status(201).send({ courseId })
})



server.listen({ port: 3333}).then(() => {
    console.log('HTTP server running!')
})