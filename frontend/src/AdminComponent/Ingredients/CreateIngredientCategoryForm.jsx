import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createIngredientCategory } from '../../component/State/Ingredients/Action';

const CreateIngredientCategoryForm = ({handleClose}) => {
    const { restaurant } = useSelector(store => store);
    const [formData, setFormData] = useState({ name: "" })
    const jwt = localStorage.getItem('jwt')
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            restaurantId: restaurant.usersRestaurant.id,
        }
        console.log(formData);
        dispatch(createIngredientCategory({ data, jwt }))
        //clear formData
        setFormData({ name: "" })
        handleClose()
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    }
    return (
        <div className=''>
            <div className='p-5'>
                <h1 className='text-gray-400 text-center text-xl pb-10'>Create Ingredient Category</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <TextField
                        fullWidth
                        id='name'
                        name='name'
                        label='Category Name'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.name}
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

export default CreateIngredientCategoryForm
