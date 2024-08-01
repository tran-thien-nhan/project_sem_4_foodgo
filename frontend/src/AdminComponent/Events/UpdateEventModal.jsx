import React, { useState } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

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

const UpdateEventModal = ({ open, handleClose, event, handleUpdate }) => {
    const [formValues, setFormValues] = useState({
        id: event.id,
        name: event.name,
        location: event.location,
        description: event.description,
        startedAt: event.startedAt,
        endsAt: event.endsAt,
        images: event.images,
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDateChange = (date, dateType) => {
        const formattedDate = date ? dayjs(date).format('DD/MM/YYYY h:mm A') : '';
        setFormValues({ ...formValues, [dateType]: formattedDate });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(formValues);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style, width: 400 }}>
                <h2>Update Event</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label="Event Name"
                        value={formValues.name}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="location"
                        label="Location"
                        value={formValues.location}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        value={formValues.description}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DateTimePicker
                            label="Start Date and Time"
                            value={dayjs(formValues.startedAt, 'DD/MM/YYYY h:mm A')}
                            onChange={(newValue) => handleDateChange(newValue, 'startedAt')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
                            sx={{mt:2}}
                        />
                        <DateTimePicker
                            label="End Date and Time"
                            value={dayjs(formValues.endsAt, 'DD/MM/YYYY h:mm A')}
                            onChange={(newValue) => handleDateChange(newValue, 'endsAt')}
                            renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
                            sx={{mt:2}}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt:2}}>
                        Update Event
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateEventModal;
