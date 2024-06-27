import { Box, Button, Chip, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField, Tooltip } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../util/UploadToCloudinary';

const initialValues = {
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: '',
    vegetarian: true,
    seasonal: false,
    ingredients: [],
    images: [],
};

const CreateMenuForm = () => {
    const [uploadImage, setUploadImage] = useState(false);

    const formik = useFormik({
        initialValues,
        validate: (values) => {
            const errors = {}
            if (!values.name) {
                errors.name = 'Name is required'
            }
            if (!values.description) {
                errors.description = 'Description is required'
            }
            return errors
        },
        onSubmit: (values) => {
            values.restaurantId = 2
            console.log("data: ", values);
        }
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        setUploadImage(true)
        const image = await uploadImageToCloudinary(file)
        formik.setFieldValue("images", [...formik.values.images, image])
        setUploadImage(false)
    };

    const handleRemoveImage = (index) => {
        const uploadImages = [...formik.values.images];
        uploadImages.splice(index, 1);
        formik.setFieldValue("images", uploadImages);
    };

    return (
        <div className='py-10 lg:flex items-center justify-center min-h-screen'>
            <div className='lg:max-w-4xl '>
                <h1 className='font-bold text-2xl text-center py-2'>Add New Menu</h1>
                <form onSubmit={formik.handleSubmit} className='space-y-4'>
                    <Grid container spacing={2}>

                        <Grid item xs={12} className='flex flex-wrap gap-5'>
                            <input
                                accept='image/*'
                                id='fileInput'
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                type="file"
                            />
                            <label htmlFor="fileInput" className='relative'>
                                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                                    <Tooltip title="add more image" placement="bottom" arrow>
                                        <AddPhotoAlternateIcon
                                            className='text-white'
                                        />
                                    </Tooltip>
                                </span>
                                {
                                    uploadImage &&
                                    <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                                        <CircularProgress />
                                    </div>
                                }
                            </label>
                            <div
                                className='flex flex-wrap gap-2'
                            >
                                {
                                    formik.values.images.map((image, index) =>
                                        <div className='relative'>
                                            <img
                                                className='w-24 h-24 object-cover'
                                                key={index}
                                                src={image}
                                                alt=""
                                            />
                                            <IconButton
                                                onClick={() => handleRemoveImage(index)}
                                                size='small'
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    outline: 'none',
                                                }}
                                            >
                                                <Tooltip title="remove this image" placement="bottom" arrow>
                                                    <CloseIcon
                                                        sx={{ fontSize: '1rem' }}
                                                    />
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                    )
                                }
                            </div>
                        </Grid>

                        {/* name */}
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                id='name'
                                name='name'
                                label='Name'
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            >

                            </TextField>
                        </Grid>

                        {/* description */}
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                id='description'
                                name='description'
                                label='Description'
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            >

                            </TextField>
                        </Grid>

                        {/* price */}
                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >
                            <TextField
                                fullWidth
                                id='price'
                                name='price'
                                label='Price'
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.price}
                            >

                            </TextField>
                        </Grid>

                        {/* category */}
                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.category}
                                    label="Category"
                                    onChange={formik.handleChange}
                                    name='category'
                                >
                                    {
                                        ["noodle", "rice", "burger"].map((category) =>
                                            <MenuItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* ingredients */}
                        <Grid
                            item
                            xs={12}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Ingredients</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    name='ingredients'
                                    multiple
                                    value={formik.values.ingredients}
                                    onChange={formik.handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Ingredients" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                // MenuProps={MenuProps}
                                >
                                    {["bread", "sauce", "rice"].map((name, index) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Seasonal */}
                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Is Seasonal</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.seasonal}
                                    label="Is Seasonal"
                                    onChange={formik.handleChange}
                                    name='seasonal'
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* vegetarian */}
                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Is Vegetarian</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.vegetarian}
                                    label="Is Vegetarian"
                                    onChange={formik.handleChange}
                                    name='vegetarian'
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                    >
                        Create Restaurant
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateMenuForm
