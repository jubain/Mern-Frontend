import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import PlaceList from '../components/PlaceList'

export default function UserPlaces() {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId
    const [loadedPlaces, setloadedPlaces] = useState()
    useEffect(() => {
        const getPlaces = async () => {
            try {
                const data = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`,
                )
                setloadedPlaces(data.places);
            } catch (error) { }
        }
        getPlaces();
    }, [sendRequest, userId])

    const placeDeleteHandler = (deletedPlaceId) => {
        setloadedPlaces(prevPlace => prevPlace.filter(place => place.id !== deletedPlaceId));
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'>
                <LoadingSpinner />
            </div>}
            {!isLoading && loadedPlaces &&
                <PlaceList
                    items={loadedPlaces}
                    onDelete={placeDeleteHandler}
                />}
        </>
    )
}