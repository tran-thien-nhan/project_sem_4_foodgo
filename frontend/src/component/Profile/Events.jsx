import React, { useEffect, useState } from 'react'
import EventCard from './EventCard'
import { useDispatch, useSelector } from 'react-redux';
import { addEventToFavorite, getEventsByRestaurant } from '../State/Event/Action';
import { getUser } from '../State/Authentication/Action';

const Events = () => {
  const { restaurant, auth } = useSelector(store => store);
  const events = useSelector(state => state.event.events);
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);

  useEffect(() => {
    dispatch(getUser({
      jwt: localStorage.getItem('jwt')
    }));
  }, [dispatch]);

  const handleAddEventToFavorites = (event) => {
    dispatch(addEventToFavorite({
      eventId: event.id,
      jwt: localStorage.getItem('jwt')
    }));
  };

  return (
    <div
      className='my-7 px-5 flex flex-wrap gap-5 justify-center items-center'
    >
      {
        auth.user?.eventDto.map((event) => <EventCard event={event} onAddEventToFavorites={handleAddEventToFavorites} eventsFavorites={auth.user?.eventDtoFavorites} onShow={show}/>)
      }
    </div>
  )
}

export default Events
