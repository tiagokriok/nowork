import { join } from 'path'
import HeroRepository from '../repositories/heroRepository'
import HeroService from '../services/heroServices'

const filename = join(__dirname, '../../database', 'data.json')

export const generateInstance = () => {
  const heroRepository = new HeroRepository({
    file: filename,
  })

  const heroService = new HeroService({
    heroRepository,
  })

  return heroService
}
