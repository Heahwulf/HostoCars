const lodash = require('lodash');

/**
 * Extracts the file name from its URL.
 *
 * @param url
 *     The file URL
 *
 * @returns {string} the file name
 */
export const extractFileNameFromURL = url => {
    const startIndex = (0 <= url.indexOf('\\') ? url.lastIndexOf('\\') : url.lastIndexOf('/'));
    let filename = url.substring(startIndex);
    if (0 === filename.indexOf('\\') || 0 === filename.indexOf('/')) {
        filename = filename.substring(1);
    }
    return filename;
};

/**
 * Formats a date to display the month as a string and the full year.
 *
 * @param date
 *     The date to format
 *
 * @returns {string} the formatted date
 */
export const formatDateLabel = date => {
    const dateObject = new Date(date);
    return null === date ? undefined : `${lodash.capitalize(dateObject.toLocaleString('default', { month: 'long' }))} ${dateObject.getFullYear()}`;
};

/**
 * Returns a random number generated from the current date time.
 *
 * @returns {number} the generated random number
 */
export const generateRandomNumber = () => {
    return new Date().getTime() + Math.random();
};

/**
 * Reads a file and converts it to a byte array.
 *
 * @param file
 *     The file to read
 *
 * @returns {[]} the result byte array
 */
export const loadFileAsByteArray = file => {
    let result = [];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function (e) {
        if (FileReader.DONE === e.target.readyState) {
            const array = new Uint8Array(e.target.result);
            for (let i = 0; i < array.length; i++) {
                result.push(array[i]);
            }
        }
    };

    return result;
};
