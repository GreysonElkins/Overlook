import 'chai'
import { expect } from 'chai'
import Customer from '../src/Customer'
import { users, rooms, bookings } from './faux-data'

describe('Customer', () => {

  let nicksBookings;

  beforeEach(() => {

    nicksBookings = [{
      "id": "5fwrgu4i7k55hl6t8",
      "userID": 3,
      "date": "2020/02/05",
      "roomNumber": 4,
      "roomServiceCharges": []
    }, {
      "id": "5fwrgu4i7k55hl6tf",
      "userID": 3,
      "date": "2020/01/25",
      "roomNumber": 2,
      "roomServiceCharges": []
    }, {
      "id": "5fwrgu4i7k55hl6tl",
      "userID": 3,
      "date": "2020/01/10",
      "roomNumber": 8,
      "roomServiceCharges": []
    }]

  })

  it('should be a function', () => {
    expect(Customer).to.be.a('Function')
  })

  it('should receive a name/number from a user object', () => {
    let me = new Customer(users[0])
    expect(me.id).to.equal(1)
    expect(me.name).to.equal('Greyson Elkins')
  }) 

  it('should be an extension of User', () => {
    let me = new Customer(users[0])
    expect(me.createBooking).to.be.a('function')
  })

  it('should be able to store it\'s own bookings', () => {
    let nick = new Customer(users[2], bookings)
    expect(nick.bookings).to.deep.equal(nicksBookings)
  })

  it('should have an empty array for bookings if none are provided', () => {
    let nick = new Customer(users[2])
    expect(nick.bookings).to.deep.equal([])
  })

  it('should know the amount it has spent on rooms', () => {
    let nick = new Customer(users[2], bookings, rooms)
    expect(nick.accountBalance).to.equal(429.44 + 477.38 + 261.26)
  })

  it('should have a balance of 0 if rooms aren\'t provided', () => {
    let nick = new Customer(users[2], bookings)
    expect(nick.accountBalance).to.equal(0)
  })

  it('should create bookings with it\'s own ID be default', () => {
    let nick = new Customer(users[2])
    let result = nick.createBooking(2, '09/04/3800')
    expect(result.userID).to.equal(3)
  })

})
