import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEventToFavorite, getAllFavoritedRestaurantsEvents, getFavoritesEvents } from '../State/Event/Action';
import EventCard from './EventCard';
import { getUser } from '../State/Authentication/Action';

const Notification = () => {
    const { auth, event } = useSelector(state => state);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [show, setShow] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (jwt) {
            console.log("EVENTS: ",event);
            dispatch(getUser(jwt));
            dispatch(getFavoritesEvents(jwt)); // Dispatch hành động để lấy sự kiện yêu thích
            dispatch(getAllFavoritedRestaurantsEvents(jwt));
        }
    }, [dispatch, jwt]);

    const handleAddEventToFavorites = (eventId) => {
        if (jwt) {
            dispatch(addEventToFavorite({ eventId, jwt }));
        }
    };

    return (
        <div className='my-7 px-5 flex flex-wrap gap-5 justify-center items-center'>
            {
                event.favorites && Array.isArray(event.favorites) ? (
                    event.favorites.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onAddEventToFavorites={() => handleAddEventToFavorites(event.id)}
                            eventsFavorites={event.favorites}
                            onShow={show}
                        />
                    ))
                ) : (
                    <p>Không có sự kiện nào trong danh sách yêu thích.</p>
                )
            }
        </div>
    );
}

export default Notification;
