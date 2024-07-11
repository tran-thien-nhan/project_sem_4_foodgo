import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { useDispatch, useSelector } from 'react-redux';
import { addEventToFavorite, getAllFavoritedRestaurantsEvents, getFavoritesEvents } from '../State/Event/Action';
import { getUser } from '../State/Authentication/Action';

const Events = () => {
  const { auth, event } = useSelector(store => store);
  const dispatch = useDispatch();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    dispatch(getUser(jwt));
    dispatch(getFavoritesEvents(jwt));
    dispatch(getAllFavoritedRestaurantsEvents(jwt));
  }, [dispatch, jwt]);

  useEffect(() => {
    filterEvents();
    extractRestaurantNames();
  }, [auth.user, event.events]);

  useEffect(() => {
    filterEvents();
  }, [selectedRestaurant]);

  const handleAddEventToFavorites = (event) => {
    dispatch(addEventToFavorite({
      eventId: event.id,
      jwt: jwt
    }));
  };

  const filterEvents = () => {
    if (auth.user?.eventDto && event.events) {
      const filtered = auth.user.eventDto.filter(userEvent => {
        const matchingEvent = event.events.find(e => e.id === userEvent.id);
        return matchingEvent?.available && (selectedRestaurant === '' || matchingEvent.restaurant.name === selectedRestaurant);
      });
      setFilteredEvents(filtered);
    }
  };

  const extractRestaurantNames = () => {
    if (event.events) {
      const names = [...new Set(event.events.map(e => e.restaurant.name))];
      setRestaurantNames(names);
    }
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestaurant(e.target.value);
  };

  return (
    <div className='my-7 px-5 flex flex-wrap gap-5 justify-center items-center'>
      <div className='w-full flex justify-center mb-5'>
        <select
          value={selectedRestaurant}
          onChange={handleRestaurantChange}
          className='p-2 border rounded bg-black text-white'
        >
          <option value=''>Tất cả nhà hàng</option>
          {restaurantNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {filteredEvents.map((event) =>
        <EventCard
          key={event.id}
          event={event}
          onAddEventToFavorites={handleAddEventToFavorites}
          eventsFavorites={auth.user?.eventDtoFavorites}
          onShow={true}
        />
      )}
    </div>
  );
}

export default Events;
