import { Box, Button, Grid, Modal, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';

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
  images: '',
  location: '',
  name: '',
  startedAt: null,
  endsAt: null,
};

const Events = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formValues, setFormValues] = useState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit: ", formValues);
    setFormValues(initialValues);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date, dateType) => {
    const formattedDate = date ? dayjs(date).format('DD/MM/YYYY h:mm A') : '';
    setFormValues({ ...formValues, [dateType]: formattedDate });
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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name='images'
                    label='Image URL'
                    variant='outlined'
                    fullWidth
                    value={formValues.images}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name='location'
                    label='Location'
                    variant='outlined'
                    fullWidth
                    value={formValues.location}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name='name'
                    label='Event Name'
                    variant='outlined'
                    fullWidth
                    value={formValues.name}
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start date and Time"
                      value={formValues.startedAt ? dayjs(formValues.startedAt, 'DD/MM/YYYY h:mm A') : null}
                      onChange={(newValue) => handleDateChange(newValue, "startedAt")}
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
                      value={formValues.endsAt ? dayjs(formValues.endsAt, 'DD/MM/YYYY h:mm A') : null}
                      onChange={(newValue) => handleDateChange(newValue, "endsAt")}
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

export default Events;
