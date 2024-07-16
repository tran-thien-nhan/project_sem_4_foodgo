import React, { useEffect } from 'react'
import './Home.css'
import MultiItemCarousel from './MultiItemCarousel'
import RestaurantCard from '../Restaurant/RestaurantCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRestaurantsAction, getAllRestaurantsPublicAction } from '../State/Restaurant/Action'
import { useNavigate } from 'react-router-dom'
import { findCart } from '../State/Cart/Action'
import { addEventToFavorite, getAllPubLicEvents } from '../State/Event/Action'
import EventCard from '../Profile/EventCard'
import Slider from 'react-slick'
import { Grid } from '@mui/material'

const Home = () => {
    const dispatch = useDispatch()
    const jwt = localStorage.getItem('jwt')
    const { auth, restaurant, event } = useSelector(store => store)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllRestaurantsAction(jwt))
        dispatch(getAllRestaurantsPublicAction())
        dispatch(getAllPubLicEvents())
    }, [])

    const handleAddEventToFavorites = (event) => {
        if (jwt) {
            dispatch(addEventToFavorite({
                eventId: event.id,
                jwt: jwt
            }));
        }
        else {
            navigate('/account/login')
        }
    };

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
                <div className='cover absolute top-0 left-0 right-0'>

                </div>
                <div className='fadout'>

                </div>
            </section>
            <section className='p-10 lg:py-10 lg:px-20 pt-10'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Top Meal</h1>
                <MultiItemCarousel />
            </section>
            <section className='px-5 lg:px-20'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-5'>Our Restaurants</h1>
                <div
                    className='flex flex-wrap justify-around gap-5'
                >
                    {
                        restaurant.restaurants?.map((item, index) => <RestaurantCard item={item} />)
                    }
                </div>
            </section>
            <section className='p-5 lg:px-20'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3 pb-5'>Our Events</h1>
                <Slider {...settings} className='px-10'>
                    {
                        event.publicEvents.filter(e => e.available).map((e) => (
                            <div key={e.id} className='px-10'>
                                <EventCard
                                    event={e}
                                    onShow={true}
                                    onAddEventToFavorites={handleAddEventToFavorites}
                                    eventsFavorites={auth.user?.eventDtoFavorites}
                                />
                            </div>
                        ))
                    }
                </Slider>
            </section>
        </div>
    )
}

export default Home
