import React, { useContext, useState } from 'react'
import Button from '../../shared/components/FormElements/Button'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators'

import './Auth.css'

export default function Auth() {
    const [isLogin, setisLogin] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { login } = useContext(AuthContext)

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const sumbitHandler = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const response = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    { 'Content-Type': 'application/json' }
                );
                login(response.userId, response.token);
            } catch (error) {
                console.log(error)
            }

        } else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.username.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const response = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    'POST',
                    formData,
                );
                login(response.userId, response.token);
            } catch (error) {
            }
        }
    }

    const switchModeHandler = () => {
        if (!isLogin) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                username: {
                    value: "",
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setisLogin(prevState => !prevState)
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <form onSubmit={sumbitHandler}>
                    {!isLogin &&
                        <>
                            <Input
                                id='username'
                                element='input'
                                type='text'
                                label='Username'
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter an username."
                                onInput={inputHandler}
                            />
                            <ImageUpload
                                id="image"
                                center
                                onInput={inputHandler}
                                errorText="Please provide image"
                            />
                        </>
                    }
                    <Input
                        id='email'
                        element='input'
                        type='email'
                        label='Email'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        id='password'
                        element='input'
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>{isLogin ? 'LOGIN' : 'SIGN UP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLogin ? "SIGN UP" : "LOGIN"}</Button>
            </Card>
        </>
    )
}