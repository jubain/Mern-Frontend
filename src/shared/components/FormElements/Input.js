import React, { useEffect, useReducer } from 'react'
import { validate } from '../../utils/validators'
import './Input.css'

function inputReducer(state, action) {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.value,
                isValid: validate(action.value, action.validators)
            }
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state
    }
}

export default function Input(props) {

    const [inputState, dispatch] = useReducer(inputReducer,
        { value: props.value || "", isValid: props.valid || false, isTouched: false }
    )

    const { id, onInput } = props
    const { value, isValid } = inputState

    useEffect(() => {
        onInput(id, value, isValid)
    }, [isValid, value, id, onInput])

    function changeHandler(e) {
        dispatch({ type: "CHANGE", value: e.target.value, validators: props.validators })
    }

    function touchHandler() {
        dispatch({ type: 'TOUCH' })
    }

    const element = props.element === 'input' ?
        <input
            onBlur={touchHandler}
            value={inputState.value}
            onChange={changeHandler}
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
        /> :
        <textarea
            onBlur={touchHandler}
            onChange={changeHandler}
            id={props.id}
            rows={props.row || 3} >
            {inputState.value}
        </textarea>

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}