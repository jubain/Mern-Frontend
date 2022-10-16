import React, { useContext, useState } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'

import './PlaceItem.css'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

export default function PlaceItem(props) {

    const { userId, token } = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [showMap, setShowMap] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)

    const openDeleteHandler = () => setShowDeleteModal(true)
    const closeDeleteHandler = () => setShowDeleteModal(false)
    const confirmDeleteHandler = async () => {
        setShowDeleteModal(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
                "DELETE",
                null,
                { Authorization: 'Bearer ' + token }
            )
            props.onDelete(props.id);
        } catch (error) {

        }
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map
                        center={props.coordinates}
                        zoom={16}
                    />
                </div>
            </Modal>

            <Modal
                show={showDeleteModal}
                onCancel={closeDeleteHandler}
                header="Are you sure?"
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={closeDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </>
                }
            >
                <p>Do you want to delete this post?</p>
            </Modal>

            <li className='place-item'>
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {userId === props.creator &&
                            <>
                                <Button to={`/places/${props.id}/update`}>EDIT</Button>
                                <Button onClick={openDeleteHandler} danger>DELETE</Button>
                            </>
                        }
                    </div>
                </Card>
            </li>
        </>

    )
}