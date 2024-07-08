import { Box, Button, CircularProgress, Grid, IconButton, Modal, TextField, Tooltip } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../util/UploadToCloudinary';
import { useFormik } from 'formik';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../../component/State/Event/Action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  images: [],
  location: '',
  name: '',
  description: '',
  startedAt: null,
  endsAt: null,
};

const CreateEvent = () => {
  const [open, setOpen] = useState(false);
  const { restaurant, menu } = useSelector(store => store);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [uploadImage, setUploadImage] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit: ", formValues);
    setFormValues(initialValues);
  };

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Name is required'
      }

    },
    onSubmit: (values) => {
      const data = {
        name: values.name,
        location: values.location,
        description: values.description,
        startedAt: values.startedAt,
        endsAt: values.endsAt,
        images: values.images,
      }
      console.log("data:  ", data)
      dispatch(createEvent({
        eventData: data,
        jwt: localStorage.getItem('jwt'),
        restaurantId: restaurant.usersRestaurant?.id
      }))

      //clear form
      handleClose();
    }
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date, dateType) => {
    const formattedDate = date ? dayjs(date).format('DD/MM/YYYY h:mm A') : '';
    // setFormValues({ ...formik.values, [dateType]: formattedDate });
    formik.setFieldValue(dateType, formattedDate);
  };

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
    <div>
      <div className='p-5'>
        <Button
          variant='contained'
          onClick={handleOpen}
        >
          Create new event
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1 className='text-2xl font-bold text-center mb-5'>
              Create New Event
            </h1>

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>

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

                <Grid item xs={12}>
                  <TextField
                    name='location'
                    label='Location'
                    variant='outlined'
                    fullWidth
                    value={formik.values.location}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name='name'
                    label='Event Name'
                    variant='outlined'
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name='description'
                    label='Description'
                    variant='outlined'
                    fullWidth
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start date and Time"
                      value={formik.values.startedAt ? dayjs(formik.values.startedAt, 'DD/MM/YYYY h:mm A') : null}
                      onChange={(newValue) => handleDateChange(newValue, 'startedAt')}
                      inputFormat="DD/MM/YYYY h:mm A"
                      className='w-full'
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="End date and Time"
                      value={formik.values.endsAt ? dayjs(formik.values.endsAt, 'DD/MM/YYYY h:mm A') : null}
                      onChange={(newValue) => handleDateChange(newValue, 'endsAt')}
                      inputFormat="DD/MM/YYYY h:mm A"
                      className='w-full'
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mt: 2 }}
              >
                Create Event
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default CreateEvent;
