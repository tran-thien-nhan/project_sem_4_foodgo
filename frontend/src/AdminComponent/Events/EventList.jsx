import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsByRestaurant } from '../../component/State/Event/Action';
import EventCard from '../../component/Profile/EventCard';

const EventList = () => {
  const { restaurant } = useSelector(store => store);
  const events = useSelector(state => state.event.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEventsByRestaurant({
      restaurantId: restaurant.usersRestaurant?.id,
      jwt: localStorage.getItem('jwt')
    }));
  }, [dispatch, restaurant]);

  return (
    <div className="flex justify-center items-center gap-5">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventList;
