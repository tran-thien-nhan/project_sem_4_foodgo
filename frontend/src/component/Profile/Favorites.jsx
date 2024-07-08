import React, { useEffect } from 'react'
import RestaurantCard from '../Restaurant/RestaurantCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRestaurantsAction } from '../State/Restaurant/Action'
import { getUser } from '../State/Authentication/Action'

const Favorites = () => {
  const { auth } = useSelector(store => store)
  const dispatch = useDispatch()
  const jwt = localStorage.getItem('jwt')
  console.log("auth.favorites: ", auth.favorites);

  useEffect(() => {
    dispatch(getAllRestaurantsAction(jwt))
    dispatch(getUser(jwt));
  }, [])
  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorites</h1>
      <div className='flex flex-wrap gap-4 justify-center'>
        {
          auth.favorites.map((item) => <RestaurantCard item={item} />)
        }
      </div>
    </div>
  )
}

export default Favorites
