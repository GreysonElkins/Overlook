import './css/base.scss'

import './images/background.png'
import './images/user-icon.png'
import './images/overlook.jpg'

import EventHandler from './EventHandler'
import DataHandler from './dataHandler'


const eventHandler = new EventHandler()
const dataHandler = new DataHandler()

dataHandler.getAllData(eventHandler.hotel, 'users', 'rooms', 'bookings')