import React, { useState, useEffect } from 'react';
import {
    Button, Card, CardContent, CardHeader, Grid, ImageList, ImageListItem, Modal, Box,
    TextField, IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDriverImage, getDriverProfile, updateDriver } from '../../component/State/Driver/Action';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Tooltip, CircularProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../../AdminComponent/util/UploadToCloudinary';
import { Bounce, toast } from "react-toastify";

const ShipperDetails = () => {
    const dispatch = useDispatch();
    const driverProfile = useSelector(store => store.driver.data);
    const jwt = localStorage.getItem('jwt');
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedDriverInfo, setUpdatedDriverInfo] = useState({});
    const [newImage, setNewImage] = useState('');
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState({
        imageOfDriver: false,
        imageOfLicense: false,
        imageOfVehicle: false,
    });

    useEffect(() => {
        dispatch(getDriverProfile(jwt));
    }, [dispatch, jwt]);

    const alertError = (string) => {
        toast.error(string, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    const validateInput = (name, value) => {
        let error = '';
        switch (name) {
            case 'phone':
                const phoneRegex = /^[0-9\b]+$/;
                if (!phoneRegex.test(value)) {
                    error = 'Phone number must contain only digits';
                    alertError(error);
                } else if (value.length !== 10) {
                    error = 'Phone number must be exactly 10 digits long';
                    alertError(error);
                }
                break;
            
            default:
                break;
        }
        return error;
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setOpenImageModal(true);
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
        setSelectedImage(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const error = validateInput(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
        setUpdatedDriverInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateClick = () => {
        dispatch(updateDriver(driverProfile.id, { data: updatedDriverInfo, jwt }));
        setEditMode(false);
    };

    const handleEditClick = () => {
        setEditMode(true);
        setUpdatedDriverInfo({
            name: driverProfile.name,
            email: driverProfile.email,
            phone: driverProfile.phone,
            imageOfDriver: driverProfile.imageOfDriver,
            licenseNumber: driverProfile.license?.licenseNumber,
            licenseState: driverProfile.license?.licenseState,
            licenseExpirationDate: driverProfile.license?.licenseExpirationDate,
            color: driverProfile.vehicle?.color,
            capacity: driverProfile.vehicle?.capacity,
            make: driverProfile.vehicle?.make,
            model: driverProfile.vehicle?.model,
            year: driverProfile.vehicle?.year,
            imageOfLicense: driverProfile.license?.imageOfLicense,
            imageOfVehicle: driverProfile.vehicle.imageOfVehicle,
            vehicle: driverProfile.vehicle,
            license: driverProfile.license,
            city: driverProfile.address.city,
            state: driverProfile.address.state,
            streetAddress: driverProfile.address.streetAddress,
            country: driverProfile.address.country,
            pinCode: driverProfile.address.pinCode
        });
    };


    const handleDeleteImage = (imageType, index) => {
        const imageUrl = driverProfile[imageType][index];
        dispatch(deleteDriverImage(driverProfile.id, imageUrl, jwt));
    };

    const handleAddImage = (imageType) => {
        const updatedImages = [...driverProfile[imageType], newImage];
        setUpdatedDriverInfo((prevState) => ({
            ...prevState,
            [imageType]: updatedImages,
        }));
        setNewImage('');
    };

    const handleImageChange = async (e, field) => {
        const files = e.target.files;
        const uploadPromises = [];
        for (let i = 0; i < files.length; i++) {
            uploadPromises.push(uploadImageToCloudinary(files[i]));
        }
        setUploading((prev) => ({ ...prev, [field]: true }));
        const uploadedImages = await Promise.all(uploadPromises);
        setUpdatedDriverInfo((prevState) => ({
            ...prevState,
            [field]: [...(prevState[field] || []), ...uploadedImages],
        }));
        setUploading((prev) => ({ ...prev, [field]: false }));
    };

    const handleRemoveImage = (field, index) => {
        const images = [...updatedDriverInfo[field]];
        images.splice(index, 1);
        setUpdatedDriverInfo((prevState) => ({
            ...prevState,
            [field]: images,
        }));
    };


    if (!driverProfile) {
        return <p>Loading...</p>;
    }

    return (
        <div className='container mx-auto py-10'>
            <div className='text-center mb-10'>
                {editMode ? (
                    <TextField
                        name="name"
                        value={updatedDriverInfo.name}
                        onChange={handleInputChange}
                        sx={{ marginRight: "1rem" }}
                    />
                ) : (
                    <h1 className='text-3xl lg:text-5xl font-bold mb-5'>{driverProfile.name}</h1>
                )}
                <Button
                    size='large'
                    variant='contained'
                    color={driverProfile.available ? 'success' : 'error'}
                >
                    {driverProfile.available ? 'Available' : 'Unavailable'}
                </Button>
            </div>
            <div className='text-center mb-10'>
                {editMode ? (
                    <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary" onClick={handleEditClick}>
                        Edit
                    </Button>
                )}
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="Shipper" />
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='flex'>
                                    <p className='w-48'>Name</p>
                                    {editMode ? (
                                        <TextField
                                            name="name"
                                            value={updatedDriverInfo.name}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.name}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Email</p>
                                    <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.email}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Phone</p>
                                    {editMode ? (
                                        <TextField
                                            name="phone"
                                            value={updatedDriverInfo.phone}
                                            onChange={handleInputChange}
                                            inputProps={{ maxLength: 10, minLength: 10}}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.phone}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>City</p>
                                    {editMode ? (
                                        <TextField
                                            name="city"
                                            value={updatedDriverInfo.city}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.address.city}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>street Address</p>
                                    {editMode ? (
                                        <TextField
                                            name="streetAddress"
                                            value={updatedDriverInfo.streetAddress}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.address.streetAddress}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>province/ state</p>
                                    {editMode ? (
                                        <TextField
                                            name="state"
                                            value={updatedDriverInfo.state}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.address.state}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Pin code</p>
                                    {editMode ? (
                                        <TextField
                                            name="pinCode"
                                            value={updatedDriverInfo.pinCode}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.address.pinCode}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Country</p>
                                    {editMode ? (
                                        <TextField
                                            name="country"
                                            value={updatedDriverInfo.country}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.address.country}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Rating</p>
                                    <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.rating}</p>
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Total Revenue</p>
                                    <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.totalRevenue}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="Shipper Images" />
                        <CardContent>
                            {
                                !editMode
                                &&
                                <ImageList variant="masonry" cols={3} gap={8}>
                                    {driverProfile.imageOfDriver?.map((item, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                srcSet={`${item}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item}?w=100&fit=crop&auto=format`}
                                                loading="lazy"
                                                alt="driver"
                                                className='cursor-pointer'
                                                onClick={() => handleImageClick(item)}
                                            />
                                            {editMode && (
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteImage('imageOfDriver', index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            }

                            {editMode && (
                                <div className='flex flex-wrap gap-5'>
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
                                    <ImageList variant="masonry" cols={3} gap={8}>
                                        {updatedDriverInfo.imageOfDriver?.map((image, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    srcSet={`${image}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${image}?w=100&fit=crop&auto=format`}
                                                    loading="lazy"
                                                    alt={`Driver ${index + 1}`}
                                                    className='w-24 h-24 object-cover'
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
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="License" />
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='flex'>
                                    <p className='w-48'>License Number</p>
                                    {editMode ? (
                                        <TextField
                                            name="licenseNumber"
                                            value={updatedDriverInfo.licenseNumber}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.license?.licenseNumber}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>State</p>
                                    {editMode ? (
                                        <TextField
                                            name="licenseState"
                                            value={updatedDriverInfo.licenseState}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.license?.licenseState}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Expiration Date</p>
                                    {editMode ? (
                                        <TextField
                                            name="licenseExpirationDate"
                                            value={updatedDriverInfo.licenseExpirationDate}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.license?.licenseExpirationDate}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="Vehicle" />
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='flex'>
                                    <p className='w-48'>Color</p>
                                    {editMode ? (
                                        <TextField
                                            name="color"
                                            value={updatedDriverInfo.color}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.vehicle?.color}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Capacity</p>
                                    {editMode ? (
                                        <TextField
                                            name="capacity"
                                            value={updatedDriverInfo.capacity}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.vehicle?.capacity}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Make</p>
                                    {editMode ? (
                                        <TextField
                                            name="make"
                                            value={updatedDriverInfo.make}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.vehicle?.make}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Model</p>
                                    {editMode ? (
                                        <TextField
                                            name="model"
                                            value={updatedDriverInfo.model}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.vehicle?.model}</p>
                                    )}
                                </div>
                                <div className='flex'>
                                    <p className='w-48'>Year</p>
                                    {editMode ? (
                                        <TextField
                                            name="year"
                                            value={updatedDriverInfo.year}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className='text-gray-400'><span className='pr-5'>-</span>{driverProfile.vehicle?.year}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={12}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="License, paper Images" />
                        <CardContent>
                            {
                                !editMode
                                &&
                                <ImageList variant="masonry" cols={3} gap={8}>
                                    {driverProfile.license.imageOfLicense?.map((item, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                srcSet={`${item}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item}?w=100&fit=crop&auto=format`}
                                                loading="lazy"
                                                alt="driver"
                                                className='cursor-pointer'
                                                onClick={() => handleImageClick(item)}
                                            />
                                            {editMode && (
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteImage('license.imageOfLicense', index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            }

                            {editMode && (
                                <div className='flex flex-wrap gap-5'>
                                    <input
                                        accept='image/*'
                                        id='imageOfLicense'
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageChange(e, 'imageOfLicense')}
                                        type='file'
                                        multiple
                                    />
                                    <label htmlFor='imageOfLicense' className='relative'>
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
                                    <ImageList variant="masonry" cols={3} gap={8}>
                                        {updatedDriverInfo.imageOfLicense.map((image, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    srcSet={`${image}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${image}?w=100&fit=crop&auto=format`}
                                                    loading="lazy"
                                                    alt={`Driver ${index + 1}`}
                                                    className='w-24 h-24 object-cover'
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
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader title="Vehicle Images" />
                        <CardContent>
                            {
                                !editMode
                                &&
                                <ImageList variant="masonry" cols={3} gap={8}>
                                    {driverProfile.vehicle.imageOfVehicle?.map((item, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                srcSet={`${item}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item}?w=100&fit=crop&auto=format`}
                                                loading="lazy"
                                                alt="driver"
                                                className='cursor-pointer'
                                                onClick={() => handleImageClick(item)}
                                            />
                                            {editMode && (
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteImage('vehicle.imageOfVehicle', index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            }

                            {editMode && (
                                <div className='flex flex-wrap gap-5'>
                                    <input
                                        accept='image/*'
                                        id='imageOfVehicle'
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageChange(e, 'imageOfVehicle')}
                                        type='file'
                                        multiple
                                    />
                                    <label htmlFor='imageOfVehicle' className='relative'>
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
                                    <ImageList variant="masonry" cols={3} gap={8}>
                                        {updatedDriverInfo.imageOfVehicle.map((image, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    srcSet={`${image}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${image}?w=100&fit=crop&auto=format`}
                                                    loading="lazy"
                                                    alt={`Driver ${index + 1}`}
                                                    className='w-24 h-24 object-cover'
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
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Modal
                open={openImageModal}
                onClose={handleCloseImageModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    style={{ transform: 'translate(-50%, -50%)', overflow: 'auto', maxHeight: '90vh' }}
                    width="100%"
                    bgcolor="black"
                    p={4}
                >
                    <img src={selectedImage} alt="Selected" className="w-full h-auto" />
                </Box>
            </Modal>

        </div>
    );
};

export default ShipperDetails;
