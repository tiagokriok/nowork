import http, { IncomingMessage, ServerResponse } from 'http'
import Hero from './entities/hero'
import { generateInstance } from './factories/heroFactory'
import { IHero } from './repositories/heroRepository'

const heroService = generateInstance()

interface Request extends IncomingMessage {
  query: {
    [key in string]: string
  }
  body: {
    [key in string]: any
  }
}

interface Response extends ServerResponse {}

interface Routes {
  [key: string]: (request: Request, response: Response) => Promise<void>
}

const routes: Routes = {
  '/heroes:get': async (request: Request, response: Response) => {
    const { id } = request.query
    const heroes = await heroService.find(Number(id))
    response.write(JSON.stringify(heroes))

    response.end()
  },
  '/heroes:post': async (request: Request, response: Response) => {
    try {
      const item = request.body as IHero
      const hero = new Hero(item)
      const { errors, valid } = hero.isValid()

      if (!valid) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify(errors))
        response.end()
      }

      response.write(JSON.stringify(await heroService.create(item)))
      response.end()
    } catch (error) {
      console.error(error)
      response.writeHead(400, { 'Content-Type': 'application/json' })
      response.write(JSON.stringify(error))
      response.end()
    }
  },
  default: async (_request: Request, response: Response) => {
    response.writeHead(404)

    response.end('Not Found')
  },
}

const handlerError = (response: ServerResponse) => {
  return (error: unknown) => {
    console.error('Internal server error', error)
    response.writeHead(500, { 'Content-Type': 'application/json' })
    response.write(
      JSON.stringify({ message: 'Internal server error', status: 'error' }),
    )
    return response.end()
  }
}

const handler = async (
  incomingRequest: IncomingMessage,
  outgoingResponse: ServerResponse,
) => {
  const request = Object.create(incomingRequest)
  const { url, method } = request
  // const allPaths = url!.split('/')
  // console.log(allPaths)
  const [first, route, id] = url!.split('/')

  request.query = { id: isNaN(id) ? id : Number(id) }

  for await (const data of incomingRequest) {
    try {
      request.body = JSON.parse(data)
    } catch (error) {
      console.error(error)
    }
  }

  const key = `/${route}:${method?.toLocaleLowerCase()}`

  console.log(`${method} ${url}`)

  outgoingResponse.writeHead(200, {
    'Content-Type': 'application/json',
  })

  const routerHandler = routes[key] || routes.default

  return routerHandler(request, outgoingResponse).catch(
    handlerError(outgoingResponse),
  )
}

http.createServer(handler).listen(3333, () => {
  console.log('Server running on port 3333')
})
