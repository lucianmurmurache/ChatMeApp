/*
    Table of contents:
     1. Firebase init
     2. Set navigation title as username
     3. Display elements
     4. Stop listening for authentication and changes
     5. Update the message state with input data
     6. Add message
     7. Get messages from local(async) storage
     8. Save messages locally(asyncStorage)
     9. Delete messages locally(asyncStorage)
    10. Send message and save locally
    11. Hide inputToolbar when offline
    12. Set message bubble colour
    13. Custom view display when the message contains location
    14. Render custom actions in inputToolbar
*/

import React from 'react';
import 'firebase/firestore';
import firebase from 'firebase';
import CustomActions from './CustomActions';
import NetInfo from '@react-native-community/netinfo';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';



export default class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: '',
            },
            isConnected: false,
            image: null,
        };

        // 1. Firebase init
        if (!firebase.apps.length) {
            firebase.initializeApp({
                /*
                   Enter the following data from Firebase:
                   apiKey: '',
                   authDomain: '',
                   databaseURL: '',
                   projectId: '',
                   storageBucket: '',
                   messagingSenderId: ,
                   appId: '',
                   measurementId: '' 
               */
            });
        }
        this.referenceMessages = firebase.firestore().collection('messages');
    };

    // 2. Set navigation title as username - information taken from Start.js
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        };
    };

    // 3. Display elements
    componentDidMount() {
        NetInfo.fetch().then(state => {
            // Check if the user is online
            if (state.isConnected) {
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        try {
                            await firebase.auth().signInAnonymously();
                        } catch (error) {
                            console.log(`Unable to sign in: ${error.message}`);
                        }
                    }
                    // Update the user state with the most recent data
                    this.setState({
                        isConnected: true,
                        user: {
                            _id: user.uid,
                            name: this.props.navigation.state.params.name,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                        messages: [],
                    });
                    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                });
            } else {
                // The user is offline
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    };

    // 4. Stop listening for authentication and changes
    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
    };

    // 5. Update the message state with input data 

    /**
     * Update the message state with the most recent data 
     * @function onCollectionUpdate
     * @param {string} _id - message id
     * @param {string} text - message content
     * @param {date} cratedAt - date and time of message
     * @param {string} user - user data
     * @param {string} image
     * @param {number} location - geographical coordinates
     * @param {boolean} sent
     * @returns {state}
     */
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Go through each document
        querySnapshot.forEach(doc => {
            // Get queryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text || '',
                createdAt: data.createdAt.toDate(),
                user: data.user,
                image: data.image || '',
                location: data.location || null,
                sent: true,
            });
        });
        this.setState({
            messages
        });
    };

    // 6. Add message

    /**
     * Add message
     * @function addMessage
     * @param {string} _id - message id
     * @param {string} text - message content
     * @param {date} cratedAt - date and time of message
     * @param {string} image 
     * @param {number} location - geographical coordinates 
     * @param {boolean} sent
     */

    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || '',
            location: message.location || null,
            sent: true,
        });
    };

    // 7. Get messages from local(async) storage

    /**
     * If the user is offline, the messages are stored locally(async storage)
     * The user can access the messages when offline
     * @function getMessages
     * @param {string} messages 
     * @returns {state} messages
     */

    async getMessages() {
        let messages = [];
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(`Unable to get messages: ${error.message}`);
        }
    };

    // 8. Save messages locally(asyncStorage)

    /**
     * Save messages in local storage
     * @async
     * @function saveMessages
     * @returns {AsyncStorage} - setItem
     */
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(`Unable to save messages: ${error.message}`);
        }
    };

    // 9. Delete messages locally(asyncStorage)

    /**
     * @async
     * @function deleteMessages
     * @returns {AsyncStorage} - removeItem
     */
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(`Unable to delete messages: ${error.message}`);
        }
    };

    // 10. Send message and save locally

    /**
     * @function onSend
     * @param {string} messages - the data can take the form of message, image or geo location
     * @returns {state} @GiftedChat append - the state is updated to include the most recent data(also saved locally)
     */
    onSend = (messages = []) => {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => {
            this.addMessage();
            this.saveMessages();
        });
    };

    // 11. Hide inputToolbar when offline

    /**
     * Only if the user is online the input toolbar is returned 
     * @function renderInputToolbar
     * @param {*} props 
     * @returns {InputToolbar}
     */
    renderInputToolbar(props) {
        if (this.state.isConnected) {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    };

    // 12. Set message bubble colour

    /**
     * @function renderBubble
     * @param {*} props 
     * @returns {Bubble}
     */
    renderBubble(props) {
        {/* Colour choices:
           * https://coolors.co/
        */}
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#0E3B43'
                    },
                    left: {
                        backgroundColor: '#357266'
                    }
                }}
            />
        );
    };

    // 13. Custom view display when the message contains location

    /**
     * If the message contains geo location coordinates, mapView is returned
     * @function renderCustomActions
     * @param {*} props 
     * @returns {MapView}
     */
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage?.location?.latitude && currentMessage?.location?.longitude) {
            return (
                <MapView
                    style={styles.mapContainer}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    loadingEnabled={true}
                    showsCompass={true}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.05,
                    }}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: currentMessage.location.latitude,
                            longitude: currentMessage.location.longitude,
                        }}
                    />
                </MapView>
            );
        }
        return null;
    };

    // 14. Render custom actions in inputToolbar

    /**
     * Render image selector, take photo and share location
     * @function renderCustomActions
     * @param {*} props
     * @returns {CustomActions}
     */
    renderCustomActions = (props) => <CustomActions {...props} />;

    render() {
        return (
            <View style={[
                styles.container,
                { backgroundColor: this.props.navigation.state.params.color },
            ]}>
                <GiftedChat
                    scrollToBottom
                    renderAvatarOnTop
                    showUserAvatar={true}
                    user={this.state.user}
                    messages={this.state.messages}
                    renderUsernameOnMessage={true}
                    showAvatarForEveryMessage={true}
                    renderCustomView={this.renderCustomView}
                    renderActions={this.renderCustomActions}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    timeTextStyle={{ left: { color: '#FFF' }, right: { color: '#FFF' } }}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null /* Keyboard spacer for Android*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#FFFFFF',
        backgroundColor: '#000000',
    },
    mapContainer: {
        margin: 1,
        width: 250,
        height: 200,
        borderRadius: 13,
    },
});
