import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../State/Authentication/Action';
import { useUser } from '@clerk/clerk-react';

const GoogleSignUpSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const handleGoogleSignUpSuccess = async () => {
            try {
                if (!isSignedIn) {
                    throw new Error("User is not signed in");
                }

                console.log('User object:', user);

                const { emailAddresses, firstName, lastName } = user;

                const values = {
                    fullName: `${firstName} ${lastName}`,
                    email: emailAddresses[0].emailAddress,
                    password: "123",
                    role: "ROLE_CUSTOMER",
                    provider: "GOOGLE",
                };

                dispatch(registerUser({ userData: values, navigate }));
            } catch (error) {
                console.error("Error during Google Sign Up Success handling:", error);
            }
        };

        handleGoogleSignUpSuccess();
    }, [dispatch, navigate, isSignedIn, user]);

    return <div>Google Sign Up Success</div>;
};

export default GoogleSignUpSuccess;
