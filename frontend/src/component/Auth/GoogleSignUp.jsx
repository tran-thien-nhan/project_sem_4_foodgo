import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignIn, SignInButton, SignUp, UserButton, useSignUp, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../State/Authentication/Action';

const GoogleSignUp = () => {
    // const { user } = useUser();
    // const { signUp } = useSignUp(); 
    // const navigate = useNavigate();
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     if(user) {
    //         const { emailAddresses, fullName } = signUp;
    //         const values = {
    //             email: emailAddresses[0]?.emailAddress || "",
    //             fullName: fullName || "",
    //             role: "ROLE_CUSTOMER",
    //             password: "123",
    //             provider: "GOOGLE"
    //         }
    //         dispatch(registerUser({ userData: values, navigate }));
    //     }
    //     else {
    //         console.log("no user ");
    //     }
    // }, [user, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
            <div className="w-full max-w-md">
                <SignUp 
                />
            </div>
        </div>
    );
}

export default GoogleSignUp;
