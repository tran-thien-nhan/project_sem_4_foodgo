import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, CircularProgress, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../../AdminComponent/util/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getDriverProfile, registerDriver } from '../../component/State/Driver/Action';

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
  vehicleLicensePlate: '',
  capacity: '',
  imageOfVehicle: [],
};

const CreateShipperInFoForm = () => {
  const [uploading, setUploading] = useState({
    imageOfDriver: false,
    imageOfLicense: false,
    imageOfVehicle: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      dispatch(getDriverProfile(jwt));
    }
  }, [jwt]);

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
      if (!values.vehicleLicensePlate) errors.vehicleLicensePlate = 'Vehicle License Plate is required';
      if (!values.capacity) errors.capacity = 'Vehicle capacity is required';
      return errors;
    },
    onSubmit: (values) => {
      const data = {
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        country: values.country,
        licenseNumber: values.licenseNumber,
        licenseState: values.licenseState,
        licensePlate: values.licensePlate,
        licenseExpirationDate: values.licenseExpirationDate,
        make: values.make,
        model: values.model,
        year: values.year,
        color: values.color,
        capacity: values.capacity,
        vehicleLicensePlate: values.vehicleLicensePlate,
        imageOfDriver: values.imageOfDriver,
        imageOfLicense: values.imageOfLicense,
        imageOfVehicle: values.imageOfVehicle,
      };
      console.log("Form values: ", data);
      dispatch(registerDriver({data, jwt}));
    }
  });

  const handleImageChange = async (e, field) => {
    const files = e.target.files;
    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      uploadPromises.push(uploadImageToCloudinary(files[i]));
    }
    setUploading((prev) => ({ ...prev, [field]: true }));
    const uploadedImages = await Promise.all(uploadPromises);
    formik.setFieldValue(field, [...formik.values[field], ...uploadedImages]);
    setUploading((prev) => ({ ...prev, [field]: false }));
  };

  const handleRemoveImage = (field, index) => {
    const images = [...formik.values[field]];
    images.splice(index, 1);
    formik.setFieldValue(field, images);
  };

  return (
    <div className='py-10 lg:flex items-center justify-center min-h-screen'>
      <div className='lg:max-w-4xl'>
        <h1 className='font-bold text-2xl text-center py-2'>Create Shipper Information</h1>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <Grid container spacing={2}>
            {/* Shipper Info Address */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='streetAddress'
                name='streetAddress'
                label='Street Address'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.streetAddress}
                error={formik.touched.streetAddress && Boolean(formik.errors.streetAddress)}
                helperText={formik.touched.streetAddress && formik.errors.streetAddress}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='city'
                name='city'
                label='City'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.city}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='state'
                name='state'
                label='state/ province'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.state}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='pinCode'
                name='pinCode'
                label='PinCode'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.pinCode}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id='country'
                name='country'
                label='Country'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.country}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            </Grid>
            {/* Driver Image */}
            <Grid item xs={12} className='flex flex-wrap gap-5'>
              <input
                accept='image/*'
                id='driverImageInput'
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 'imageOfDriver')}
                type='file'
                multiple
              />
              <label htmlFor='driverImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add driver image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading.imageOfDriver && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfDriver.map((image, index) => (
                <div key={index} className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={image}
                    alt={`Driver ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfDriver', index)}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Tooltip title='Remove driver image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              ))}
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
                multiple
              />
              <label htmlFor='licenseImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add license image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading.imageOfLicense && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfLicense.map((image, index) => (
                <div key={index} className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={image}
                    alt={`License ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfLicense', index)}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Tooltip title='Remove license image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              ))}
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
                id='vehicleLicensePlate'
                name='vehicleLicensePlate'
                label='Vehicle License Plate'
                variant='outlined'
                onChange={formik.handleChange}
                value={formik.values.vehicleLicensePlate}
                error={formik.touched.vehicleLicensePlate && Boolean(formik.errors.vehicleLicensePlate)}
                helperText={formik.touched.vehicleLicensePlate && formik.errors.vehicleLicensePlate}
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
                multiple
              />
              <label htmlFor='vehicleImageInput' className='relative'>
                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                  <Tooltip title='Add vehicle image' placement='bottom' arrow>
                    <AddPhotoAlternateIcon />
                  </Tooltip>
                </span>
                {uploading.imageOfVehicle && (
                  <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.imageOfVehicle.map((image, index) => (
                <div key={index} className='relative'>
                  <img
                    className='w-24 h-24 object-cover'
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imageOfVehicle', index)}
                    size='small'
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Tooltip title='Remove vehicle image' placement='bottom' arrow>
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </Tooltip>
                  </IconButton>
                </div>
              ))}
            </Grid>
          </Grid>
          <Button type='submit' variant='contained' fullWidth>Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipperInFoForm;
