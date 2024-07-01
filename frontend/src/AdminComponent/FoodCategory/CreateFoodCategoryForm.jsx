import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction } from '../../component/State/Restaurant/Action';

const CreateFoodCategoryForm = () => {
    const { restaurant } = useSelector(store => store);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ categoryName: "", restaurantId: "" })

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.categoryName,
            // restaurantId: formData.restaurantId
            restaurantId: {
                id: restaurant.usersRestaurant.id
            }
        }

        dispatch(createCategoryAction({ reqData: data, jwt: localStorage.getItem('jwt') }))
        // clear form
        setFormData({ categoryName: "", restaurantId: "" })
        console.log(data)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    }
    return (
        <div className=''>
            <div className='p-5'>
                <h1 className='text-gray-400 text-center text-xl pb-10'>Create Food Category</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <TextField
                        fullWidth
                        id='categoryName'
                        name='categoryName'
                        label='Food Category Name'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.categoryName}
                    >

                    </TextField>
                    <Button
                        variant='contained'
                        type='submit'
                        fullWidth={true}
                    >
                        Create a new category
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateFoodCategoryForm
