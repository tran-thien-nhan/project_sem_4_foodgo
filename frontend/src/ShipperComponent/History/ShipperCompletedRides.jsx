import React, { useState } from 'react';
import { Card, CardContent, Typography, Modal, Button, TextField, TablePagination, CircularProgress, Box } from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { MapContainer, Marker, TileLayer, Polyline } from 'react-leaflet';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const ShipperCompletedRides = ({ rides }) => {
    const [selectedRide, setSelectedRide] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [route, setRoute] = useState([]);

    const openModal = (ride) => {
        setSelectedRide(ride);
        setIsModalOpen(true);
        fetchRoute(ride);
    };

    const closeModal = () => {
        setSelectedRide(null);
        setIsModalOpen(false);
        setRoute([]);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const padZero = (num) => (num < 10 ? `0${num}` : num);
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = padZero(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
    };

    const createCarMarker = () => {
        const el = document.createElement('div');
        el.className = 'car-marker';
        el.style.backgroundImage = `url(https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png)`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';

        return L.divIcon({ className: 'custom-icon', html: el.outerHTML });
    };

    const customMarkerIcon = createCarMarker();

    const fetchRoute = async (ride) => {
        const { restaurantLatitude, restaurantLongitude, destinationLatitude, destinationLongitude } = ride;
        try {
            const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${restaurantLongitude},${restaurantLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=geojson`);
            const routeCoordinates = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRoute(routeCoordinates);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    const filteredRides = rides.filter((ride) =>
        ride.rideId.toString().includes(searchQuery) ||
        ride.driverId.toString().includes(searchQuery) ||
        ride.restaurantAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.userAddress.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    const paginatedRides = filteredRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleDownloadCSV = () => {
        const ws = XLSX.utils.json_to_sheet(filteredRides);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Completed Rides');
        const wbout = XLSX.write(wb, { type: 'array', bookType: 'csv' });
        FileSaver.saveAs(new Blob([wbout], { type: 'text/csv' }), 'completed_rides.csv');
    };

    const handleDownloadPDF = () => {
        try {
            if (selectedRide) {
                const doc = new jsPDF();
                doc.text(`Ride ID: ${selectedRide.rideId}`, 10, 10);
                doc.text(`Driver ID: ${selectedRide.driverId}`, 10, 20);
                doc.text(`Restaurant ID: ${selectedRide.restaurantId}`, 10, 30);
                doc.text(`From: ${selectedRide.restaurantAddress}`, 10, 40);
                doc.text(`To: ${selectedRide.userAddress}`, 10, 50);
                doc.text(`Order ID: ${selectedRide.orderId}`, 10, 60);
                doc.text(`Start Time: ${formatDateTime(selectedRide.startTime)}`, 10, 70);
                doc.text(`End Time: ${formatDateTime(selectedRide.endTime)}`, 10, 80);
                doc.text(`Distance: ${selectedRide.distance.toFixed(2)} km`, 10, 90);
                doc.text(`Fare: ${selectedRide.fare.toLocaleString('vi-VN')} VND`, 10, 100);
                doc.text(`Status: ${selectedRide.status}`, 10, 110);
                doc.save('completed_ride.pdf');
            }
        }
        catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Completed Rides</h2>
            <div className="mb-4">
                <TextField
                    variant="outlined"
                    label="Search for"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full"
                />
            </div>
            <Button
                variant="contained"
                sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                startIcon={<DownloadIcon />}
                onClick={handleDownloadCSV}
            >
                Export CSV File
            </Button>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : paginatedRides?.length ? (
                paginatedRides.map((ride, index) => (
                    <Card key={index} className="mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent>
                            <Typography variant="h6" className="mb-2">Ride {ride.rideId}</Typography>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                                onClick={() => openModal(ride)}
                                className="w-full"
                            >
                                Detail
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography className="text-center">No Completed Rides.</Typography>
            )}

            <TablePagination
                component="div"
                count={filteredRides.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="mt-4"
            />

            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    style={{ transform: 'translate(-50%, -50%)', overflow: 'auto', maxHeight: '90vh' }}
                    width="50%"
                    bgcolor="black"
                    p={4}
                >
                    <div className="flex items-center justify-center bg-opacity-50">
                        <div className="bg-black w-full h-auto max-w-2xl relative">
                            {selectedRide && (
                                <div className="space-y-4">
                                    <Typography variant="h5" className="mb-2 font-bold">Ride Information</Typography>
                                    <Typography><strong>Ride ID:</strong> {selectedRide.rideId}</Typography>
                                    <Typography><strong>Driver ID:</strong> {selectedRide.driverId}</Typography>
                                    <Typography><strong>Restaurant ID:</strong> {selectedRide.restaurantId}</Typography>
                                    <Typography><strong>restaurantLatitude:</strong> {selectedRide.restaurantLatitude}</Typography>
                                    <Typography><strong>restaurantLongitude:</strong> {selectedRide.restaurantLongitude}</Typography>
                                    <Typography><strong>destinationLatitude:</strong> {selectedRide.destinationLatitude}</Typography>
                                    <Typography><strong>destinationLongitude:</strong> {selectedRide.destinationLongitude}</Typography>
                                    <Typography><strong>From:</strong> {selectedRide.restaurantAddress}</Typography>
                                    <Typography><strong>To:</strong> {selectedRide.userAddress}</Typography>
                                    <Typography><strong>Order ID:</strong> {selectedRide.orderId}</Typography>
                                    <Typography><strong>Start Time:</strong> {formatDateTime(selectedRide.startTime)}</Typography>
                                    <Typography><strong>End Time:</strong> {formatDateTime(selectedRide.endTime)}</Typography>
                                    <Typography><strong>Distance:</strong> {selectedRide.distance.toFixed(2)} km</Typography>
                                    <Typography><strong>Fare:</strong> {selectedRide.fare.toLocaleString('vi-VN')} VND</Typography>
                                    <Typography><strong>Status:</strong> {selectedRide.status}</Typography>
                                    <Typography><strong>Comment:</strong> {selectedRide.comment}</Typography>
                                    <Typography><strong>Images:</strong></Typography>                                    
                                    <div className="flex flex-wrap space-x-2 space-y-2">
                                        {selectedRide.images.map((image, index) => (
                                            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                                                <img
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full object-cover h-48 rounded-lg shadow-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<PrintIcon />}
                                            onClick={handleDownloadPDF}
                                        >
                                            Export PDF File
                                        </Button>
                                    </div>

                                    <MapContainer center={[selectedRide.restaurantLatitude, selectedRide.restaurantLongitude]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[selectedRide.restaurantLatitude, selectedRide.restaurantLongitude]} icon={customMarkerIcon}>
                                        </Marker>
                                        <Marker position={[selectedRide.destinationLatitude, selectedRide.destinationLongitude]} icon={customMarkerIcon}>
                                        </Marker>
                                        {route.length > 0 && <Polyline positions={route} color="blue" />}
                                    </MapContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ShipperCompletedRides;
