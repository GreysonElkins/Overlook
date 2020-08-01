import './css/base.scss';
import './css/room-cards.scss';

import './images/background.png';
import './images/user-icon.png';
import './images/overlook.jpg';
import './images/rooms/single-room.png';
import './images/rooms/residential-suite.jpg';
import './images/rooms/junior-suite.jpg';
import './images/rooms/suite.jpg';

import EventHandler from './EventHandler'
import DataHandler from './DataHandler'


const eventHandler = new EventHandler()
const dataHandler = new DataHandler()

dataHandler.getAllData(eventHandler.hotel, 'users', 'rooms', 'bookings')