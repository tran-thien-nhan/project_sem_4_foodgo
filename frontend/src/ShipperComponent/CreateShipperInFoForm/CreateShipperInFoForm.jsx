import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, CircularProgress, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../../AdminComponent/util/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getDriverProfile } from '../../component/State/Driver/Action';

const initialValues = {
  imageOfDriver: [],
  licenseNumber: '',
  licenseState: '',
  licensePlate: '',
  licenseExpirationDate: '',
  imageOfLicense: [],
  make: '',
  model: '',
  year: '',
  color: '',
  licensePlate: '',
  capacity: '',
  imageOfVehicle: [],
};

const CreateShipperInFoForm = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      dispatch(getDriverProfile(jwt));
    }
  }, [jwt])

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = {};
      if (!values.licenseNumber) errors.licenseNumber = 'License number is required';
      if (!values.licenseState) errors.licenseState = 'License state is required';
      if (!values.licensePlate) errors.licensePlate = 'License plate is required';
      if (!values.licenseExpirationDate) errors.licenseExpirationDate = 'License expiration date is required';
      if (!values.make) errors.make = 'Vehicle make is required';
      if (!values.model) errors.model = 'Vehicle model is required';
      if (!values.year) errors.year = 'Vehicle year is required';
      if (!values.color) errors.color = 'Vehicle color is required';
      if (!values.licensePlate) errors.licensePlate = 'License plate is required';
      if (!values.capacity) errors.capacity = 'Vehicle capacity is required';
      return errors;
    },
    onSubmit: (values) => {
      const data = {
        licenseNumber: values.licenseNumber,
        licenseState: values.licenseState,
        licensePlate: values.licensePlate,
        licenseExpirationDate: values.licenseExpirationDate,
        make: values.make,
        model: values.model,
        year: values.year,
        color: values.color,
        capacity: values.capacity,
        images: values.images,
      }
      console.log("Form values: ", values);
    }
  });

  const handleImageChange = async (e, field) => {
    const file = e.target.files[0]
    setUploadImage(true)
    const image = await uploadImageToCloudinary(file)
    formik.setFieldValue(field, [...formik.values.images, image])
    setUploadImage(false)
  };

  const handleRemoveImage = (index, field) => {
    const uploadImages = [...formik.values.images];
    uploadImages.splice(index, 1);
    formik.setFieldValue(field, uploadImages);
  };

  return (
    <div className='py-10 lg:flex items-center justify-center min-h-screen'>
      <div className='lg:max-w-4xl'>
        <h1 className='font-bold text-2xl text-center py-2'>Create Shipper Information</h1>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <Grid container spacing={2}>
            {/* Driver Image */}
            <Grid item xs={12} className='flex flex-wrap gap-5'>
              <input
                accept='image/*'
                id='driverImageInput'
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 'imageOfDriver')}
                type='file'
              />
              <label htmlFor='driverImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add driver image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfDriver && (
                <div className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={formik.values.imageOfDriver}
                    alt='Driver'
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfDriver')}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0, outline: 'none' }}
                  >
                    <Tooltip title='Remove driver image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              )}
            </Grid>

            {/* License Info */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='licenseNumber'
                name='licenseNumber'
                label='License Number'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.licenseNumber}
                error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
                helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='licenseState'
                name='licenseState'
                label='License State'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.licenseState}
                error={formik.touched.licenseState && Boolean(formik.errors.licenseState)}
                helperText={formik.touched.licenseState && formik.errors.licenseState}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='licenseExpirationDate'
                name='licenseExpirationDate'
                label='License Expiration Date'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.licenseExpirationDate}
                error={formik.touched.licenseExpirationDate && Boolean(formik.errors.licenseExpirationDate)}
                helperText={formik.touched.licenseExpirationDate && formik.errors.licenseExpirationDate}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='licensePlate'
                name='licensePlate'
                label='License plate'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.licensePlate}
                error={formik.touched.licensePlate && Boolean(formik.errors.licensePlate)}
                helperText={formik.touched.licensePlate && formik.errors.licensePlate}
              />
            </Grid>
            <Grid item xs={12} className='flex flex-wrap gap-5'>
              <input
                accept='image/*'
                id='licenseImageInput'
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 'imageOfLicense')}
                type='file'
              />
              <label htmlFor='licenseImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add license image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfLicense && (
                <div className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={formik.values.imageOfLicense}
                    alt='License'
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfLicense')}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Tooltip title='Remove license image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              )}
            </Grid>

            {/* Vehicle Info */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='make'
                name='make'
                label='Vehicle Make'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.make}
                error={formik.touched.make && Boolean(formik.errors.make)}
                helperText={formik.touched.make && formik.errors.make}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='model'
                name='model'
                label='Vehicle Model'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.model}
                error={formik.touched.model && Boolean(formik.errors.model)}
                helperText={formik.touched.model && formik.errors.model}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='year'
                name='year'
                label='Vehicle Year'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.year}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='color'
                name='color'
                label='Vehicle Color'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.color}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='licensePlate'
                name='licensePlate'
                label='License Plate'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.licensePlate}
                error={formik.touched.licensePlate && Boolean(formik.errors.licensePlate)}
                helperText={formik.touched.licensePlate && formik.errors.licensePlate}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='capacity'
                name='capacity'
                label='Vehicle Capacity'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.capacity}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid item xs={12} className='flex flex-wrap gap-5'>
              <input
                accept='image/*'
                id='vehicleImageInput'
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 'imageOfVehicle')}
                type='file'
              />
              <label htmlFor='vehicleImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add vehicle image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfVehicle && (
                <div className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={formik.values.imageOfVehicle}
                    alt='Vehicle'
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfVehicle')}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Tooltip title='Remove vehicle image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              )}
            </Grid>
          </Grid>
          <Button color='primary' variant='contained' fullWidth type='submit'>
            Submit
          </Button>
          <Button
            color='secondary'
            variant='contained'
            fullWidth
            onClick={() => navigate('/')}
          >
            Back
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipperInFoForm;
