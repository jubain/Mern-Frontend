import React, { useEffect, useState } from 'react'
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import UserList from '../components/UserList'

export default function Users() {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState([]);
    useEffect(() => {
        async function getUsers() {
            try {
                const response = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users`
                    );
                setLoadedUsers(response.users);
            } catch (error) {
            }

        } getUsers();

    }, [sendRequest])

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'>
                <LoadingSpinner />
            </div>}
            <UserList items={loadedUsers} />
        </>
    )
}

