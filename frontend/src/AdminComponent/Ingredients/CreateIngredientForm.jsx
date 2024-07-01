import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient, createIngredientCategory } from '../../component/State/Ingredients/Action';

const CreateIngredientForm = ({handleClose}) => {
    const { restaurant, ingredients } = useSelector(store => store);
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        price: "",
        quantity: "",
    });
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');

    console.log("restaurant: ", restaurant);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            restaurantId: restaurant.usersRestaurant?.id,
        };
        console.log("result: ", data);

        dispatch(createIngredient({ data, jwt }));
        //clear form
        setFormData({
            name: "",
            categoryId: "",
            price: "",
            quantity: "",
        })
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className=''>
            <div className='p-5'>
                <h1 className='text-gray-400 text-center text-xl pb-10'>Create Ingredient</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <TextField
                        fullWidth
                        id='name'
                        name='name'
                        label='Ingredient Name'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.name}
                    />

                    <TextField
                        fullWidth
                        id='price'
                        name='price'
                        label='Price'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.price}
                    />

                    <TextField
                        fullWidth
                        id='quantity'
                        name='quantity'
                        label='quantity'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.quantity}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.categoryId}
                            label="Category"
                            onChange={handleInputChange}
                            name='categoryId'
                        >
                            {ingredients.category.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant='contained'
                        type='submit'
                        fullWidth={true}
                    >
                        Create a new ingredient
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateIngredientForm;
