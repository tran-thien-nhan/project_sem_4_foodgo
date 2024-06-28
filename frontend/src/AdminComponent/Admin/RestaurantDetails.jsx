import { Button, Card, CardContent, CardHeader, Grid, ImageList, ImageListItem, Modal, Box } from '@mui/material';
import React, { useState } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantStatus } from '../../component/State/Restaurant/Action';

const RestaurantDetails = () => {
  const { restaurant } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleRestaurantStatus = () => {
    dispatch(updateRestaurantStatus({
      restaurantId: restaurant.usersRestaurant.id,
      jwt: jwt
    }));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className='lg:px-20 px-5 pb-10'>
      <div className='py-5 flex justify-center items-center gap-5'>
        <h1 className='text-2xl lg:text-7xl text-center font-bold p-5'>
          {restaurant.usersRestaurant?.name}
        </h1>
        <div>
          <Button
            onClick={handleRestaurantStatus}
            size='large'
            variant='contained'
            className='py-[1rem] px-[2rem]'
            color={!restaurant.usersRestaurant?.open ? 'success' : 'error'}
          >
            {restaurant.usersRestaurant?.open ? 'close' : 'open'}
          </Button>
        </div>
      </div>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}>

          <Card>
            <CardHeader
              title={<span className='text-gray-300'>Restaurant</span>}
            />
            <CardContent>
              <div className='space-y-4 text-gray-200'>
                <div className='flex'>
                  <p className='w-48'>Owner</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.owner?.fullName}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Restaurant Name</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.name}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Cuisine Type</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.cuisineType}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Opening Hours</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.openingHours}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Status</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {
                      restaurant.usersRestaurant?.open
                        ? <span className='px-5 py-2 rounded-full bg-green-400 text-gray-950'>
                          Open
                        </span>
                        : <span className='px-5 py-2 rounded-full bg-red-400 text-gray-950'>
                          Closed
                        </span>
                    }

                  </p>
                </div>

              </div>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={6}
        >

          <Card>
            <CardHeader
              title={<span className='text-gray-300'>Address</span>}
            />
            <CardContent>
              <div className='space-y-4 text-gray-200'>
                <div className='flex'>
                  <p className='w-48'>Country</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.address?.country}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>City</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.address?.city}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>State</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.address?.state}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Postal Code</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.address?.pinCode}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Street Address</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.address?.streetAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={6}
        >

          <Card>
            <CardHeader
              title={<span className='text-gray-300'>Contact</span>}
            />
            <CardContent>
              <div className='space-y-4 text-gray-200'>
                <div className='flex'>
                  <p className='w-48'>Email</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.contactInformation?.email}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Mobile</p>
                  <p className='text-gray-400'>
                    <span className='pr-5'>-</span>
                    {restaurant.usersRestaurant?.contactInformation?.mobile}
                  </p>
                </div>
                <div className='flex'>
                  <p className='w-48'>Social</p>
                  <div className='flex text-gray-400 pb-3 items-center gap-2'>
                    <p>
                      <span className='pr-5'>-</span>
                      <a href={restaurant.usersRestaurant?.contactInformation?.instagram} target='blank'>
                        <InstagramIcon sx={{ fontSize: "3rem" }} />
                      </a>
                      <a href={restaurant.usersRestaurant?.contactInformation?.facebook} target='blank'>
                        <FacebookIcon sx={{ fontSize: "3rem" }} />
                      </a>
                      <a href={restaurant.usersRestaurant?.contactInformation?.twitter} target='blank'>
                        <XIcon sx={{ fontSize: "3rem" }} />
                      </a>
                      <a href={restaurant.usersRestaurant?.contactInformation?.linkedln} target='blank'>
                        <LinkedInIcon sx={{ fontSize: "3rem" }} />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title={<span className='text-gray-300'>Images</span>} />
            <CardContent>
              <ImageList variant="masonry" cols={3} gap={8}>
                {restaurant.usersRestaurant?.images.map((item) => (
                  <ImageListItem key={item} onClick={() => handleImageClick(item)}>
                    <img
                      srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item}?w=248&fit=crop&auto=format`}
                      loading="lazy"
                      alt="restaurant"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={openImageModal} onClose={handleCloseImageModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '55%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
          onClick={handleCloseImageModal}
        >
          <img
            src={selectedImage}
            alt="restaurant"
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default RestaurantDetails;
