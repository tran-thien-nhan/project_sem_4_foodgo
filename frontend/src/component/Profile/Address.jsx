import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Modal, Box, Grid, TextField, IconButton, Typography } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddressCard from '../Cart/AddressCard';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../State/Address/Action';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationIcon from '@mui/icons-material/AddLocation';

const initialValues = {
  streetAddress: '',
  state: '',
  pinCode: '',
  city: '',
  country: 'vietnam'
};

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: 'none',
  boxShadow: 24,
  p: 4,
};

const Address = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { auth } = useSelector(store => store);
  const address = useSelector(state => state.address.addresses);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      console.log("ADDRESS: ", address);
      dispatch(getAddresses(jwt));
    }
  }, [dispatch, jwt]);

  const handleOpenModal = (address) => {
    setSelectedAddress(address);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAddress(null);
    setOpenModal(false);
  };

  const handleAddAddress = (addressData) => {
    dispatch(addAddress(addressData, jwt));
    handleCloseModal();
  };

  const handleUpdateAddress = (addressId, addressData) => {
    dispatch(updateAddress(addressId, addressData, jwt));
    handleCloseModal();
  };

  const handleDeleteAddress = (addressId) => {
    dispatch(deleteAddress(addressId, jwt));
  };

  return (
    <div className="flex justify-center items-center">
      <section className="px-5 py-10">
        <div className='flex flex-wrap items-center gap-5 justify-center'>
          {address.map((address, index) => (
            <Card key={index} className="h-56">
              <CardContent>
                <AddressCard address={address} showButton={false} />
                <div className='flex'>
                  <Button onClick={() => handleOpenModal(address)}>
                    <IconButton>
                      <BuildIcon />
                    </IconButton>
                  </Button>
                  <Button onClick={() => handleDeleteAddress(address.id)}>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
          <Card className='flex gap-5 w-64 p-5 h-56 items-center justify-center'>
            <div className='space-y-3 text-gray-500'>
              <Button variant='contained' onClick={() => handleOpenModal(null)}>
                <IconButton className='flex space-x-2'>
                  <AddLocationAltIcon />
                  <Typography
                    className='font-semibold'>
                    Add New Address
                  </Typography>
                </IconButton>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Formik
            initialValues={selectedAddress || initialValues}
            onSubmit={(values) => {
              if (selectedAddress) {
                handleUpdateAddress(selectedAddress.id, values);
              } else {
                handleAddAddress(values);
              }
            }}
            validationSchema={Yup.object({
              streetAddress: Yup.string().required('Street Address is required'),
              state: Yup.string().required('State is required'),
              pinCode: Yup.string().required('Pin Code is required'),
              city: Yup.string().required('City is required'),
            })}
          >
            {({ handleChange, handleSubmit }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='streetAddress'
                      label='Street Address'
                      fullWidth
                      variant='outlined'
                      onChange={handleChange}
                      defaultValue={selectedAddress?.streetAddress || ''}
                      error={!Boolean(ErrorMessage('streetAddress'))}
                      helperText={
                        <ErrorMessage name='streetAddress'>
                          {(msg) => <span className='text-red-600'>{msg}</span>}
                        </ErrorMessage>
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Field
                          as={TextField}
                          name='state'
                          label='State'
                          fullWidth
                          variant='outlined'
                          onChange={handleChange}
                          defaultValue={selectedAddress?.state || ''}
                          error={!Boolean(ErrorMessage('state'))}
                          helperText={
                            <ErrorMessage name='state'>
                              {(msg) => <span className='text-red-600'>{msg}</span>}
                            </ErrorMessage>
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          as={TextField}
                          name='pinCode'
                          label='Pin Code'
                          fullWidth
                          variant='outlined'
                          onChange={handleChange}
                          defaultValue={selectedAddress?.pinCode || ''}
                          error={!Boolean(ErrorMessage('pinCode'))}
                          helperText={
                            <ErrorMessage name='pinCode'>
                              {(msg) => <span className='text-red-600'>{msg}</span>}
                            </ErrorMessage>
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='city'
                      label='City'
                      fullWidth
                      variant='outlined'
                      onChange={handleChange}
                      defaultValue={selectedAddress?.city || ''}
                      error={!Boolean(ErrorMessage('city'))}
                      helperText={
                        <ErrorMessage name='city'>
                          {(msg) => <span className='text-red-600'>{msg}</span>}
                        </ErrorMessage>
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' color='primary' fullWidth>
                      {selectedAddress ? 'Update Address' : 'Add New Address'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default Address;
