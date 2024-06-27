import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';

const CreateIngredientForm = () => {
    const [formData, setFormData] = useState({ name: "", ingredientCategoryId: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            ingredientCategoryId: {
                id: 1
            }
        };
        console.log(data);
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
                        id='categoryName'
                        name='name'
                        label='Ingredient Name'
                        variant='outlined'
                        onChange={handleInputChange}
                        value={formData.name}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.ingredientCategoryId}
                            label="Category"
                            onChange={handleInputChange}
                            name='ingredientCategoryId'
                        >
                            {["noodle", "rice", "burger"].map((ingredientCategoryId, index) => (
                                <MenuItem key={index} value={ingredientCategoryId}>{ingredientCategoryId}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
    );
};

export default CreateIngredientForm;
