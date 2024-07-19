import React, { useEffect, useState } from 'react'
import './Home.css'
import MultiItemCarousel from './MultiItemCarousel'
import RestaurantCard from '../Restaurant/RestaurantCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRestaurantsAction, getAllRestaurantsPublicAction } from '../State/Restaurant/Action'
import { useNavigate } from 'react-router-dom'
import { addEventToFavorite, getAllPubLicEvents } from '../State/Event/Action'
import EventCard from '../Profile/EventCard'
import Slider from 'react-slick'
import { Grid } from '@mui/material'
import MapComponent from '../util/MapComponent'
import { getCoordinates, calculateDistance, calculateDuration, calculateFare } from '../Config/logic'

const Home = () => {
    const dispatch = useDispatch()
    const jwt = localStorage.getItem('jwt')
    const { auth, restaurant, event } = useSelector(store => store)
    const navigate = useNavigate()
    const address1 = "big c quận 7"
    const address2 = "lotte mart quận 7"

    const [coords1, setCoords1] = useState(null)
    const [coords2, setCoords2] = useState(null)
    const [distance, setDistance] = useState(null)
    const [duration, setDuration] = useState(null)
    const [fare, setFare] = useState(null)

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coordinates1 = await getCoordinates(address1)
            const coordinates2 = await getCoordinates(address2)
            setCoords1(coordinates1)
            setCoords2(coordinates2)

            if (coordinates1 && coordinates2) {
                const dist = calculateDistance(coordinates1.lat, coordinates1.lon, coordinates2.lat, coordinates2.lon)
                setDistance(dist)

                const duration = calculateDuration(dist);
                setDuration(duration);

                const fare = calculateFare(dist)
                setFare(fare)
            }
        }

        fetchCoordinates()
        dispatch(getAllRestaurantsAction(jwt))
        dispatch(getAllRestaurantsPublicAction())
        dispatch(getAllPubLicEvents())
    }, [address1, address2, dispatch, jwt])

    const handleAddEventToFavorites = (event) => {
        if (jwt) {
            dispatch(addEventToFavorite({
                eventId: event.id,
                jwt: jwt
            }))
        } else {
            navigate('/account/login')
        }
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    }

    return (
        <div className='pb-10'>
            <section className='banner -z-50 relative flex flex-col justify-center items-center'>
                <div className='w-[50vw] z-10 text-center'>
                    <h1 className='text-2xl lg:text-6xl font-bold z-10 py-5 font-serif'>FOOD GO</h1>
                    <h1 className='z-10 text-gray-300 text-xl lg:text-4xl font-serif'>Good Food is Good Mood, Order Now!</h1>
                </div>
                <div className='cover absolute top-0 left-0 right-0' />
                <div className='fadout' />
            </section>
            <section className='p-10 lg:py-10 lg:px-20 pt-10'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Top Meal</h1>
                <MultiItemCarousel />
            </section>
            <section className='px-5 lg:px-20'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-5'>Our Restaurants</h1>
                <div className='flex flex-wrap justify-around gap-5'>
                    {restaurant.restaurants?.map((item, index) => <RestaurantCard key={index} item={item} />)}
                </div>
            </section>
            <section className='p-5 lg:px-20'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-5'>Our Events</h1>
                <Slider {...settings} className='px-10'>
                    {event.publicEvents.filter(e => e.available).map((e) => (
                        <div key={e.id} className='px-10'>
                            <EventCard
                                event={e}
                                onShow={true}
                                onAddEventToFavorites={handleAddEventToFavorites}
                                eventsFavorites={auth.user?.eventDtoFavorites}
                            />
                        </div>
                    ))}
                </Slider>
            </section>
            <section className='px-5 lg:px-20'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-5'>Coordinates</h1>
                <div>
                    <p>Coordinates for {address1}: {coords1 ? `Lat: ${coords1.lat}, Long: ${coords1.lon}` : 'Loading...'}</p>
                    <p>Coordinates for {address2}: {coords2 ? `Lat: ${coords2.lat}, Long: ${coords2.lon}` : 'Loading...'}</p>
                    <p>Distance: {distance !== null ? `${distance.toFixed(2)} km` : 'Calculating distance...'}</p>
                    <p>Duration: {duration !== null ? `${duration.toFixed(2)} minutes` : 'Calculating duration...'}</p>
                    <p>Fare: {fare !== null ? `${fare.toLocaleString('vi-VN')} VND` : 'Calculating fare...'}</p>
                </div>
            </section>
        </div>
    )
}

export default Home
