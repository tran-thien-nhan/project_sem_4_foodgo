import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsByRestaurant, toggleAvailable, updateEvent } from '../../component/State/Event/Action';
import EventCard from '../../component/Profile/EventCard';
import UpdateEventModal from './UpdateEventModal';

const EventList = () => {
  const { restaurant } = useSelector(store => store);
  const events = useSelector(state => state.event.events);
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(true);

  useEffect(() => {
    dispatch(getEventsByRestaurant({
      restaurantId: restaurant.usersRestaurant?.id,
      jwt: localStorage.getItem('jwt')
    }));
  }, [dispatch, restaurant]);

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (updatedEventData) => {
    const { id: eventId, ...eventData } = updatedEventData;
    dispatch(updateEvent({ eventId, eventData, jwt: localStorage.getItem('jwt') }));
    handleCloseModal();
  };

  const handleUpdateVisibility = (event) => {
    handleToggle(event);
  };

  const handleToggle = (event) => {
    dispatch(toggleAvailable({
      eventId: event.id,
      jwt: localStorage.getItem('jwt')
    }))
  };

  return (
    <div className="flex justify-center items-center gap-5">
      {events.map((event, index) => (
        <EventCard key={index} event={event} onEdit={handleEditEvent} showEdit={showEdit} onUpdateAvailability={handleUpdateVisibility} />
      ))}
      {selectedEvent && (
        <UpdateEventModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          event={selectedEvent}
          handleUpdate={handleUpdateEvent}
        />
      )}
    </div>
  );
};

export default EventList;
