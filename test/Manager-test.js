import 'chai'
import { expect } from 'chai'
import Manager from '../src/Manager'

// import { users, rooms, bookings } from './faux-data'

describe('Manager', () => {

  it('should be a function', () => {
    expect(Manager).to.be.a('Function')
  })

  it('should be an extension of User', () => {
    let jack = new Manager()
    expect(jack.createBooking).to.be.a('function')
  }) 

})