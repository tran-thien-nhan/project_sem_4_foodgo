import { Button, CircularProgress, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../util/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../component/State/Authentication/Action';
import { createRestaurant } from '../../component/State/Restaurant/Action';

const initialValues = {
  name: '',
  description: '',
  cuisineType: '',
  streetAddress: '',
  city: '',
  state: '',
  pinCode: '',
  country: '',
  email: '',
  mobile: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  instagram: '',
  openingHours: 'Mon-Sun : 9:00 AM - 9:00 PM',
  closingHours: '',
  images: [],
};

const CreateRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');

  const handlebackHome = () => {
    dispatch(logOut());
  }

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
      const data = {
        name: values.name,
        description: values.description,
        cuisineType: values.cuisineType,
        address: {
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          pinCode: values.pinCode,
          country: values.country,
        },
        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          twitter: values.twitter,
          facebook: values.facebook,
          instagram: values.instagram,
          linkedin: values.linkedin,
        },
        openingHours: values.openingHours,
        images: values.images,
      }
      console.log("data:  ", data)

      dispatch(createRestaurant({ data, token: jwt }));
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
        <h1 className='font-bold text-2xl text-center py-2'>Add New Restaurant</h1>
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

            {/* cuisineType */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='cuisineType'
                name='cuisineType'
                label='CuisineType'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.cuisineType}
              >

              </TextField>
            </Grid>

            {/* openingHours */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='openingHours'
                name='openingHours'
                label='Opening Hours'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.openingHours}
              >

              </TextField>
            </Grid>

            {/* streetAddress */}
            <Grid
              item
              xs={12}
            >
              <TextField
                fullWidth
                id='streetAddress'
                name='streetAddress'
                label='Street Address'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.streetAddress}
              >

              </TextField>
            </Grid>

            {/* city */}
            <Grid
              item
              xs={12}
            >
              <TextField
                fullWidth
                id='city'
                name='city'
                label='City'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.city}
              >

              </TextField>
            </Grid>

            {/* state */}
            <Grid
              item
              xs={12}
              lg={4}
            >
              <TextField
                fullWidth
                id='state'
                name='state'
                label='State/ Ward/ Province'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.state}
              >

              </TextField>
            </Grid>

            {/* pinCode */}
            <Grid
              item
              xs={12}
              lg={4}
            >
              <TextField
                fullWidth
                id='pinCode'
                name='pinCode'
                label='Pin Code/ Zip Code'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.pinCode}
              >

              </TextField>
            </Grid>

            {/* country */}
            <Grid
              item
              xs={12}
              lg={4}
            >
              <TextField
                fullWidth
                id='country'
                name='country'
                label='Country'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.country}
              >

              </TextField>
            </Grid>

            {/* email */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='email'
                name='email'
                label='Email Address'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.email}
              >

              </TextField>
            </Grid>

            {/* mobile */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='mobile'
                name='mobile'
                label='Mobile Number'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.mobile}
              >

              </TextField>
            </Grid>

            {/* instagram */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='instagram'
                name='instagram'
                label='instagram'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.instagram}
              >

              </TextField>
            </Grid>

            {/* twitter */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='twitter'
                name='twitter'
                label='Twitter'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.twitter}
              >

              </TextField>
            </Grid>

            {/* facebook */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='facebook'
                name='facebook'
                label='Facebook'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.facebook}
              >

              </TextField>
            </Grid>

            {/* linkedln */}
            <Grid
              item
              xs={12}
              lg={6}
            >
              <TextField
                fullWidth
                id='linkedin'
                name='linkedin'
                label='linkedin'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.linkedin}
              >

              </TextField>
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
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={handlebackHome}
          >
            Back
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateRestaurantForm
