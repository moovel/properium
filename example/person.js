'use strict'

const ProperiumModel = require('../lib/index').ProperiumModel
const ProperiumError = require('../lib/index').ProperiumError

class Friend extends ProperiumModel {}
Friend.defineProp('name', { type: 'string', required: true })
Friend.defineProp('mood', { type: 'string', oneOf: ['GOOD', 'BAD'] })

class Person extends ProperiumModel {}
Person.defineProp('name', { type: 'string', required: true })
Person.defineProp('age', { type: 'number', required: false })
Person.defineProp('friends', { type: 'array', subtype: Friend, defaultValue: [] })

const person = new Person()
person.name = 'Fred'
person.age = 42

const friend = new Friend()
friend.name = 'Amy'
friend.mood = 'GOOD'

// person.friends is initialized with []
person.friends.push(friend)

try {
  person.validate('person')
  console.log(JSON.stringify(person, null, 2))
} catch (err) {
  if (err instanceof ProperiumError) {
    console.error(err)
  } else {
    throw err
  }
}
