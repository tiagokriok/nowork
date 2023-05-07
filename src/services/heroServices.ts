import HeroRepository, { IHero } from '../repositories/heroRepository'

interface HeroServiceDependencies {
  heroRepository: HeroRepository
}

export default class HeroService {
  private heroRepository: HeroRepository

  constructor({ heroRepository }: HeroServiceDependencies) {
    this.heroRepository = heroRepository
  }

  async find(heroId: number) {
    return this.heroRepository.find(heroId)
  }

  async create(data: Omit<IHero, 'id'>) {
    return this.heroRepository.create(data)
  }
}
