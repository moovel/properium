'use strict'

const expect = require('chai').expect

const ProperiumModel = require('../lib/model').ProperiumModel
const ProperiumError = require('../lib/error').ProperiumError

describe('model', () => {
  it('inits primitive props with defaultValue', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', { defaultValue: 'FOO' })

    const person = new Person()

    expect(person.name).to.equal('FOO');
  })

  it('inits class props with defaultValue', () => {
    class Name {}
    class Person extends ProperiumModel {}
    Person.defineProp('name', { defaultValue: Name })

    const person = new Person()

    expect(person.name).to.be.instanceOf(Name);
  })

  it('inits function props with defaultValue', () => {
    const initName = () => 'FOO'
    class Person extends ProperiumModel {}
    Person.defineProp('name', { defaultValue: initName })

    const person = new Person()

    expect(person.name).to.equal('FOO');
  })

  it('fails for unknown properties', () => {
    class Person extends ProperiumModel {}

    const person = new Person()
    person.name = 'FOO'

    expect(() => person.validate())
      .to.throw(ProperiumError, 'unknown prop')
      .and.to.have.property('prop', 'name')
  })

  it('fails for undefined properties', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', {})

    const person = new Person()

    expect(() => person.validate())
      .to.throw(ProperiumError, 'undefined prop')
      .and.to.have.property('prop', 'name')
  })

  it('fails for nested properties', () => {
    class Pet extends ProperiumModel {}
    Pet.defineProp('name', { type: 'string' })

    class Person extends ProperiumModel {}
    Person.defineProp('pet', { type: Pet })

    const person = new Person()
    person.pet = new Pet()

    expect(() => person.validate('root'))
      .to.throw(ProperiumError, 'undefined prop')
      .and.to.have.property('prop', 'root.pet.name')
  })

  it('passes for defined properties', () => {
    class Person extends ProperiumModel {}
    Person.defineProp('name', {})

    const person = new Person()
    person.name = 'FOO'

    person.validate()
  })

  it ('returns the model after validate', () => {
    class Person extends ProperiumModel {}
    const person = new Person()

    const result = person.validate()

    expect(result).to.equal(person)
  })
})
