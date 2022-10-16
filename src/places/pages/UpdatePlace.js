import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators'


export default function UpdatePlace() {
    const [loadedPlace, setloadedPlace] = useState()
    const { isLoading, clearError, error, sendRequest } = useHttpClient()
    const placeId = useParams().placeId
    const navigate = useNavigate();
    const { userId, token } = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const getPlace = async () => {
            try {
                const data = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
                );
                setloadedPlace(data.place);
                setFormData({
                    title: {
                        value: data.place.title,
                        isValid: true
                    },
                    description: {
                        value: data.place.description,
                        isValid: true
                    }
                }, true)
            } catch (error) {

            }
        }
        getPlace();
    }, [placeId, sendRequest, setFormData])



    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            );
            navigate(`/${userId}/places`);
        } catch (error) {

        }
    }

    if (!loadedPlace) {
        return <div className='center'>
            <Card>
                Could not find place!
            </Card></div>
    }

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={submitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    value={loadedPlace.title}
                    valid={true}
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    type="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description"
                    value={loadedPlace.description}
                    valid={true}
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </>

    )
}