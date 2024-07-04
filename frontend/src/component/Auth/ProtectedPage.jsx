import { UserButton } from '@clerk/clerk-react'
import React from 'react'

const ProtectedPage = () => {
    return (
        <div>
            <h1>Protected Page</h1>
            <UserButton />
        </div>
    )
}

export default ProtectedPage
