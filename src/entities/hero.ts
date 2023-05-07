import { IHero } from '../repositories/heroRepository'

export default class Hero {
  public id: number
  public name: string
  public age: number
  public power: string

  constructor({ name, age, power }: IHero) {
    this.id = Math.floor(Math.random() * 100) + Date.now()
    this.name = name
    this.age = age
    this.power = power
  }

  isValid() {
    const propertyNames = Object.getOwnPropertyNames(this) as Array<keyof IHero>
    const amountInvalid = propertyNames
      .map((property): string | null => {
        return !!this[property] ? null : `${property} is required`
      })
      .filter(Boolean)

    return {
      valid: !amountInvalid.length,
      errors: amountInvalid,
    }
  }
}
