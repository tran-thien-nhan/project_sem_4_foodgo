import React from 'react'
import './Home.css'
import MultiItemCarousel from './MultiItemCarousel'
import RestaurantCard from '../Restaurant/RestaurantCard'

const restaurants = [1,1,1,1,1,1,1,1]
const Home = () => {
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
                    className='flex flex-wrap items-center justify-around gap-5'
                >
                    {
                        restaurants.map((item, index) => <RestaurantCard key={index} />)
                    }
                </div>
            </section>
        </div>
    )
}

export default Home
