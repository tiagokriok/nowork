import { PathLike } from 'fs'
import { readFile, writeFile } from 'fs/promises'

export interface IHero {
  id: number
  name: string
  age: number
  power: string
}

interface HeroRepositoryDependencies {
  file: PathLike
}

export default class HeroRepository {
  file: PathLike
  constructor({ file }: HeroRepositoryDependencies) {
    this.file = file
  }

  async _currentFileContent() {
    return JSON.parse(await readFile(this.file, 'utf-8'))
  }

  async find(itemId: number | undefined): Promise<IHero | IHero[] | undefined> {
    const all = (await this._currentFileContent()) as IHero[]
    if (!itemId) {
      return all
    }

    return all.find(({ id }) => id === itemId)
  }

  async create(data: Omit<IHero, 'id'>): Promise<IHero> {
    const currentFileContent = (await this._currentFileContent()) as IHero[]

    const nextId = currentFileContent.length + 1
    const newHero = { ...data, id: nextId }
    currentFileContent.push(newHero)
    await writeFile(this.file, JSON.stringify(currentFileContent, null, 2))

    return newHero
  }
}
