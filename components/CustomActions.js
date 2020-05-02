/*
    Table of contents:
    1. Select image from library 
    2. Take photo with device camera 
    3. Upload image as Blob(binary large object) to Firebase storage
    4. Get user location 
    5. Perform action according to the selected option
*/

import React from 'react';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const firebase = require('firebase');


export default class CustomActions extends React.Component {
    constructor() {
        super()
    }

    // 1.  Select image from library if permission granted

    /**
     * Requires permission to access @CAMERA_ROLL.
     * If permission is granted, it selects an image from the device library
     * The image can be edited before being sent
     * @async
     * @function selectImage
     */
    /*
        
    */
    async selectImage() {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                });

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.log(`Upload Image error: ${error.message}`);
        }
    };

    // 2. Take photo with device camera if permission granted

    /**
     * Requires permission to access @CAMERA & @CAMERA_ROLL
     * If permission is granted, it captures an image using the device camera
     * @async
     * @function takePhoto
     * @returns {Promise <string>} uri @onSend & @uploadImage
     */
    async takePhoto() {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });

                if (!result.cancelled) {
                    const imageUrlLink = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrlLink });
                }
            }
        } catch (error) {
            console.log(`takePhoto error: ${error.message}`);
        }
    };

    // 3. Upload image as Blob(binary large object) to Firebase storage

    /**
     * Upload image as Blob to Firebase
     * @async
     * @function uploadImage
     * @param {*} uri 
     * @returns {string}
     */
    async uploadImage(uri) {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = (() => {
                    resolve(xhr.response);
                });
                xhr.onerror = ((error) => {
                    console.error(error);
                    reject(new TypeError('Network Request Failed!'));
                });
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
            const getImageName = uri.split('/');
            const imageArrayLength = getImageName[getImageName.length - 1];
            const ref = firebase.storage().ref().child(`images/${imageArrayLength}`);
            //console.log(`UploadImage: ${ref, getImageName[imageArrayLength]}`);
            const snapshot = await ref.put(blob);
            blob.close();
            const imageURL = await snapshot.ref.getDownloadURL();
            return imageURL;
        } catch (error) {
            console.log(`Uploading image error: ${error.message}`);
        }
    };

    // 4. Get user location if permission granted

    /**
     * Requires permission to access @LOCATION
     * If permission is granted, it shares the device location
     * @async
     * @function getLocation
     * @returns {Promise <number>}
     */
    async getLocation() {
        try {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                //console.log(location);
                if (location) {
                    this.props.onSend({
                        location: {
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude
                        }
                    });
                }
            }
        } catch (error) {
            console.log(`getLocation error: ${error.message}`);
        }
    };

    // 5. Perform action according to the selected option

    /**
     * Perform the selected action
     * @function onActionPress
     * @returns {actionSheet} @showActionSheetWithOptions Select Image from Library, Take a Photo, Share Location and Cancel
     */
    onActionPress = () => {
        const options = ['Select Image from Library', 'Take a Photo', 'Share Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        return this.selectImage();
                    case 1:
                        return this.takePhoto();
                    case 2:
                        return this.getLocation();
                    default:
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity
                accessible={true}
                accessibilityLabel='Tap for action options!'
                accessibilityHint='The action options allow you to select an image from the library, 
                                   take a photo using the device camera or share your device location.'
                style={[styles.container]}
                onPress={this.onActionPress}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 13,
        borderColor: '#b2b2b2',
    },
    iconText: {
        fontSize: 16,
        color: '#b2b2b2',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};
