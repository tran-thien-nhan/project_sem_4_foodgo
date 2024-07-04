import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../State/Authentication/Action';
import { useDispatch } from 'react-redux';

const GoogleSignIn = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if(user) {
            const { emailAddresses, fullName } = user;
            const values = {
                email: emailAddresses[0]?.emailAddress || "",
                password: "123"
            }
            dispatch(loginUser({ userData: values, navigate }));
        }
    }, [user, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
            <div className="w-full max-w-md">
                <SignIn />
            </div>
        </div>
    );
}

export default GoogleSignIn;
