import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './ImageUpload.css'
const ImageUpload = (props) => {
    const filePickerRef = useRef();
    const [file, setfile] = useState();
    const [previewUrl, setpreviewUrl] = useState();
    const [isValid, setisValid] = useState(false);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setpreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file])


    const pickHandler = e => {
        let pickedFile
        let fileIsValid = isValid;
        if (e.target.files && e.target.files.length === 1) {
            pickedFile = e.target.files[0];
            setfile(pickedFile);
            setisValid(true);
            fileIsValid = true;
        } else {
            setisValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };
    return (
        <div className='form-control'>
            <input
                type='file'
                id={props.id}
                style={{ display: 'none' }}
                accept='.jpeg,.png,.jpg'
                ref={filePickerRef}
                onChange={pickHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img alt='preview' src={previewUrl} />}
                    {!previewUrl && <p>Please pick and image.</p>}
                </div>
                <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;