import React from 'react'
import CreateEvent from './CreateEvent'
import EventList from './EventList'

const Events = () => {
  return (
    <div className="container mx-auto p-4">
      <CreateEvent />
      <EventList />
    </div>
  )
}

export default Events
