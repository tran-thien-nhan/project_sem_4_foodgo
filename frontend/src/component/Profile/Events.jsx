import React from 'react'
import EventCard from './EventCard'

const Events = () => {
  return (
    <div
      className='mt-5 px-5 flex flex-wrap gap-5 justify-center items-center'
    >
      {
        [1, 1, 1].map((item) => <EventCard />)
      }
    </div>
  )
}

export default Events
