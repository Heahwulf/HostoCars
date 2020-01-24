import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    TextFieldProps
} from '@material-ui/core';
import { CancelRounded as CancelIcon, FolderOpenRounded as BrowseIcon, HelpOutlineRounded as HelpIcon } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';

import { extractFileNameFromURL, formatDateLabel, loadFileAsByteArray } from 'resources';

import './AddCarModal.scss';

/**
 * The text to display when the required registration field is not provided.
 * @type {string}
 */
const registrationRequiredHelperText = 'Veuillez renseigner l\'immatriculation';

/**
 * The text to display when the registration field already exists.
 * @type {string}
 */
const registrationUniqueHelperText = 'Ce numéro d\'immatriculation existe déjà';

/**
 * The text to display when the serial number field already exists.
 * @type {string}
 */
const serialNumberUniqueHelperText = 'Ce VIN existe déjà';

/**
 * The text to display when the required owner field is not provided.
 * @type {string}
 */
const ownerRequiredHelperText = 'Veuillez renseigner le nom du propriétaire';

/**
 * Modal to add a new car.
 *
 * @param className
 *     The component class name
 * @param onClose
 *     The close event handler
 * @param onValidate
 *     The validate event handler
 * @param open
 *     If the modal is open
 * @param registrations
 *     The list of existing registrations
 * @param serialNumbers
 *     The list of existing serial numbers (except the one of the current car)
 */
function AddCarModal({ className, onClose, onValidate, open, registrations, serialNumbers }) {
    // Initializes the help flag
    const [ help, setHelp ] = React.useState(false);

    // Initializes the car fields
    const [ registration, setRegistration ] = React.useState('');
    const [ serialNumber, setSerialNumber ] = React.useState('');
    const [ owner, setOwner ] = React.useState('');
    const [ brand, setBrand ] = React.useState('');
    const [ model, setModel ] = React.useState('');
    const [ motorization, setMotorization ] = React.useState('');
    const [ engineCode, setEngineCode ] = React.useState('');
    const [ releaseDate, setReleaseDate ] = React.useState(null);
    const [ certificate, setCertificate ] = React.useState(null);
    const [ picture, setPicture ] = React.useState(null);
    const [ comments, setComments ] = React.useState('');

    // Initializes the labels for the uploaded files
    const [ certificateFileName, setCertificateFileName ] = React.useState('');
    const [ pictureFileName, setPictureFileName ] = React.useState('');

    // Initializes the constraints
    const [ registrationRequired, setRegistrationRequired ] = React.useState(false);
    const [ registrationUnique, setRegistrationUnique ] = React.useState(false);
    const [ serialNumberUnique, setSerialNumberUnique ] = React.useState(false);
    const [ ownerRequired, setOwnerRequired ] = React.useState(false);

    /**
     * Clears the form.
     */
    const clearForm = () => {
        setRegistration('');
        setSerialNumber('');
        setOwner('');
        setBrand('');
        setModel('');
        setMotorization('');
        setEngineCode('');
        setReleaseDate(null);
        setCertificate(null);
        setPicture(null);
        setComments('');

        setPictureFileName('');
        setCertificateFileName('');

        setRegistrationRequired(false);
        setRegistrationUnique(false);
        setSerialNumberUnique(false);
        setOwnerRequired(false);
    };

    /**
     * Handles the dialog close action or the cancel button click action.
     */
    const onCancelAction = () => {
        clearForm();
        onClose();
    };

    /**
     * Handles the clear action for the given field.
     * @param field
     *     The field name
     */
    const onClearFieldAction = field => {
        switch (field) {
            case 'certificate':
                setCertificate(null);
                setCertificateFileName('');
                break;
            case 'picture':
                setPicture(null);
                setPictureFileName('');
                break;
            default:
                console.error('Unknown field cleared');
        }
    };

    /**
     * Handles the value changed event for the given field.
     *
     * @param e
     *     The event
     * @param field
     *     The field name
     */
    const onFieldValueChanged = (e, field) => {
        switch (field) {
            case 'registration':
                setRegistration(e.target.value);
                setRegistrationRequired(false);
                setRegistrationUnique(false);
                break;
            case 'serialNumber':
                setSerialNumber(e.target.value);
                setSerialNumberUnique(false);
                break;
            case 'owner':
                setOwner(e.target.value);
                setOwnerRequired(false);
                break;
            case 'brand':
                setBrand(e.target.value);
                break;
            case 'model':
                setModel(e.target.value);
                break;
            case 'motorization':
                setMotorization(e.target.value);
                break;
            case 'engineCode':
                setEngineCode(e.target.value);
                break;
            case 'releaseDate':
                setReleaseDate(e);
                break;
            case 'certificate':
                const certificateDocument = document.getElementById('CertificateInput');

                const certificateUrl = certificateDocument.value;
                setCertificateFileName(extractFileNameFromURL(certificateUrl));

                const certificateFile = certificateDocument.files[0];
                setCertificate(loadFileAsByteArray(certificateFile));
                break;
            case 'picture':
                const pictureDocument = document.getElementById('PictureInput');

                const pictureUrl = pictureDocument.value;
                setPictureFileName(extractFileNameFromURL(pictureUrl));

                const pictureFile = pictureDocument.files[0];
                setPicture(loadFileAsByteArray(pictureFile));
                break;
            case 'comments':
                setComments(e.target.value);
                break;
            default:
                console.error('Unknown field updated');
        }
    };

    /**
     * Handles the help button click action.
     */
    const onHelpButtonClick = () => {
        setHelp(!help);
    };

    /**
     * Handles the key pressed action.
     *
     * @param e
     *     The event
     */
    const onKeyPressed = e => {
        switch (e.keyCode) {
            case 13:
                // Prevents the event from propagating
                e.preventDefault();
                onValidateAction();
                break;
            case 27:
                // Prevents the event from propagating
                e.preventDefault();
                onCancelAction();
                break;
            default:
                break;
        }
    };

    /**
     * Handles the validation action.
     */
    const onValidateAction = () => {
        const emptyValue = '';

        // Checks the form validation
        if (validateForm()) {
            const car = {
                registration: emptyValue === registration ? null : registration,
                serialNumber: emptyValue === serialNumber ? null : serialNumber,
                owner: emptyValue === owner ? null : owner,
                brand: emptyValue === brand ? null : brand,
                model: emptyValue === model ? null : model,
                motorization: emptyValue === motorization ? null : motorization,
                engineCode: emptyValue === engineCode ? null : engineCode,
                releaseDate,
                certificate,
                picture,
                comments: emptyValue === comments ? null : comments
            };

            onValidate(car);
            onClose();
            clearForm();
        }
    };

    /**
     * Handles the validate button click action.
     */
    const onValidateButtonClick = () => {
        onValidateAction();
    };

    /**
     * Returns the text field props for the release date picker depending on the current release date value.
     *
     * @param props
     *     The initial props
     * @returns {*} the text field component with the final props
     */
    const releaseDateFieldProps = (props: TextFieldProps): any => <TextField InputProps={{ shrink: null !== releaseDate }} {...props} />;

    /**
     * Validates the form.
     *
     * @returns {boolean} if the form is valid
     */
    const validateForm = () => {
        let isValid = true;

        // Validates the registration field
        if (null === registration || '' === registration) {
            setRegistrationRequired(true);
            isValid = false;
        } else if (registrations.includes(registration)) {
            setRegistrationUnique(true);
            isValid = false;
        }

        // Validates the serial number field
        if (null !== serialNumber && '' !== serialNumber && serialNumbers.includes(serialNumber)) {
            setSerialNumberUnique(true);
            isValid = false;
        }

        // Validates the owner field
        if (null === owner || '' === owner) {
            setOwnerRequired(true);
            isValid = false;
        }

        return isValid;
    };

    /**
     * Defines the adornment of the certificate field depending on the certificate being null or not.
     */
    const certificateFieldAdornment = certificate ? (<InputAdornment position='end'>
        <IconButton onClick={() => onClearFieldAction('certificate')}>
            <CancelIcon />
        </IconButton>
    </InputAdornment>) : (<InputAdornment position='end'>
        <IconButton component='label' variant='contained'>
            <BrowseIcon />
            <input accept='image/jpe, image/jpg, image/jpeg, image/gif, image/png, image/bmp,' id='CertificateInput'
                   onChange={e => onFieldValueChanged(e, 'certificate')} type='file' />
        </IconButton>
    </InputAdornment>);

    /**
     * Defines the adornment of the image field depending on the certificate being null or not.
     */
    const pictureFieldAdornment = picture ? (<InputAdornment position='end'>
        <IconButton onClick={() => onClearFieldAction('picture')}>
            <CancelIcon />
        </IconButton>
    </InputAdornment>) : (<InputAdornment position='end'>
        <IconButton component='label' variant='contained'>
            <BrowseIcon />
            <input accept='image/jpe, image/jpg, image/jpeg, image/gif, image/png, image/bmp,' id='PictureInput'
                   onChange={e => onFieldValueChanged(e, 'picture')} type='file' />
        </IconButton>
    </InputAdornment>);

    return (<Dialog className={className} id='AddCarModal' onClose={onCancelAction} onKeyDown={onKeyPressed} open={open}>
        <DialogTitle className='Title'>
            Ajout d'une voiture

            <IconButton className='HelpButton' color='primary' onClick={onHelpButtonClick}>
                <HelpIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent>
            <DialogContentText className={!help && 'Instructions_hidden'}>
                Veuillez remplir le formulaire ci-dessous puis cliquer sur 'Ajouter' afin d'ajouter une nouvelle voiture.
                Les champs annotés du symbole * sont obligatoires.
            </DialogContentText>

            <Grid alignItems='center' container direction='column' justify='center'>
                <Grid alignItems='center' container justify='space-between' spacing={2}>
                    <Grid item xs>
                        <TextField className={`Field ${(registrationRequired || registrationUnique) && 'Field_error'}`}
                                   error={registrationRequired || registrationUnique}
                                   fullWidth
                                   helperText={registrationRequired ? registrationRequiredHelperText : registrationUnique
                                       && registrationUniqueHelperText}
                                   label="Numéro d'immatriculation"
                                   onChange={e => onFieldValueChanged(e, 'registration')}
                                   required
                                   value={registration}
                                   variant='outlined' />
                    </Grid>

                    <Grid item xs>
                        <TextField className={`Field ${(serialNumberUnique) && 'Field_error'}`}
                                   error={serialNumberUnique}
                                   fullWidth
                                   helperText={serialNumberUnique && serialNumberUniqueHelperText}
                                   label='VIN'
                                   onChange={e => onFieldValueChanged(e, 'serialNumber')}
                                   value={serialNumber}
                                   variant='outlined' />
                    </Grid>
                </Grid>

                <Grid alignItems='center' container justify='space-between' spacing={2}>
                    <Grid item xs>
                        <TextField className={`Field ${ownerRequired && 'Field_error'}`}
                                   error={ownerRequired}
                                   fullWidth
                                   helperText={ownerRequired && ownerRequiredHelperText}
                                   label='Propriétaire'
                                   onChange={e => onFieldValueChanged(e, 'owner')}
                                   required
                                   value={owner}
                                   variant='outlined' />
                    </Grid>

                    <Grid item xs>
                        <TextField className='Field' fullWidth label='Marque' onChange={e => onFieldValueChanged(e, 'brand')}
                                   value={brand} variant='outlined' />
                    </Grid>
                </Grid>

                <Grid alignItems='center' container justify='space-between' spacing={2}>
                    <Grid item xs>
                        <TextField className='Field' fullWidth label='Modèle' onChange={e => onFieldValueChanged(e, 'model')}
                                   value={model} variant='outlined' />
                    </Grid>

                    <Grid item xs>
                        <TextField className='Field' fullWidth label='Motorisation'
                                   onChange={e => onFieldValueChanged(e, 'motorization')} value={motorization} variant='outlined' />
                    </Grid>
                </Grid>

                <Grid alignItems='center' container justify='space-between' spacing={2}>
                    <Grid item xs>
                        <TextField className='Field' fullWidth label='Code moteur'
                                   onChange={e => onFieldValueChanged(e, 'engineCode')} value={engineCode} variant='outlined' />
                    </Grid>

                    <Grid item xs>
                        <DatePicker autoOk
                                    cancelLabel='Annuler'
                                    className='Field'
                                    clearable
                                    clearLabel='Supprimer'
                                    disableFuture
                                    disableToolbar
                                    fullWidth
                                    inputVariant='outlined'
                                    label='Date de mise en circulation'
                                    labelFunc={formatDateLabel}
                                    onChange={e => onFieldValueChanged(e, 'releaseDate')}
                                    TextFieldComponent={releaseDateFieldProps}
                                    value={releaseDate}
                                    variant='dialog'
                                    views={[ 'year', 'month' ]} />
                    </Grid>
                </Grid>
            </Grid>

            <FormControl className='Field' fullWidth variant='outlined'>
                <InputLabel htmlFor='CertificateField'>Carte grise</InputLabel>

                <OutlinedInput id='CertificateField' endAdornment={certificateFieldAdornment} labelWidth={80} readOnly value={certificateFileName} />
            </FormControl>

            <FormControl className='Field' fullWidth variant='outlined'>
                <InputLabel htmlFor='PictureField'>Image</InputLabel>

                <OutlinedInput id='PictureField' endAdornment={pictureFieldAdornment} labelWidth={46} readOnly value={pictureFileName} />
            </FormControl>

            <TextField className='Field' fullWidth label='Commentaires' multiline onChange={e => onFieldValueChanged(e, 'comments')}
                       rowsMax={4} value={comments} variant='outlined' />
        </DialogContent>

        <DialogActions>
            <Button className='CancelButton' color='primary' onClick={onCancelAction}>
                Annuler
            </Button>

            <Button autoFocus className='ValidateButton' color='primary' onClick={onValidateButtonClick}>
                Ajouter
            </Button>
        </DialogActions>
    </Dialog>);
}

AddCarModal.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    registrations: PropTypes.arrayOf(PropTypes.string),
    serialNumbers: PropTypes.arrayOf(PropTypes.string)
};

AddCarModal.defaultProps = {
    className: '',
    registrations: [],
    serialNumbers: []
};

export default AddCarModal;
