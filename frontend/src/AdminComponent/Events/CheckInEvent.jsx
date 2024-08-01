import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventAttendeesAnalytics, getListCheckIn, getListUsersByEvent, isUserCheckin } from '../../component/State/Event/Action';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TextField, TablePagination, Button } from '@mui/material';

const CheckInEvent = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const { event } = useSelector(store => store);
    const jwt = localStorage.getItem('jwt');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        if (jwt) {
            dispatch(getListUsersByEvent(eventId, jwt));
            dispatch(getListCheckIn(eventId, jwt));
            dispatch(getEventAttendeesAnalytics(eventId, jwt));
        }
    }, [eventId, jwt, dispatch]);

    useEffect(() => {
        if (event.analytics) {
            setAnalytics(event.analytics);
        }
    }, [event.analytics]);

    const handleCheckIn = (userId) => {
        dispatch(isUserCheckin(eventId, userId, jwt)).then(() => {
            dispatch(getEventAttendeesAnalytics(eventId, jwt));
        });
    };

    const isCheckedIn = (userId) => {
        return event.checkIns.some(user => user.userId === userId) && event.listCheckIns.some(user => user.userId === userId);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleReset = () => {
        setSearchTerm('');
        setPage(0);
        setRowsPerPage(10);
    };

    const filteredUsers = event.checkIns.filter((user) => {
        return (
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.includes(searchTerm)
        );
    });

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">List of Users Attending Event</h1>
            <div className="flex mb-4 space-x-4">
                <TextField
                    label="Search by Name or Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="mb-4 flex">
                <Button
                    className="mb-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => navigate("/admin/restaurants/event")}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Event Attendee Analytics</h1>
                <p className='text-gray-500 font-extrabold'>Total Invited: {analytics.totalInvited}</p>
                <p className='text-gray-500 font-extrabold'>Total Checked In: {analytics.totalCheckedIn}</p>
                <p className='text-gray-500 font-extrabold'>Percentage Checked In: {analytics.percentageCheckedIn}%</p>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Check-In</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        color="primary"
                                        checked={isCheckedIn(user.userId)}
                                        onChange={() => handleCheckIn(user.userId)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}

export default CheckInEvent;
