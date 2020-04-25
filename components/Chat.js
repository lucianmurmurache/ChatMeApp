import React, { Component } from 'react';
import { View, StyleSheet, Platform, AsyncStorage, /*Dimensions*/ } from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends Component {
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

        // Firebase init
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: 'AIzaSyBq-QCkcxewGL-E4bI6dFqeJ70qEqc9hxM',
                authDomain: 'chatmeapp-a125c.firebaseapp.com',
                databaseURL: 'https://chatmeapp-a125c.firebaseio.com',
                projectId: 'chatmeapp-a125c',
                storageBucket: 'chatmeapp-a125c.appspot.com',
                messagingSenderId: '866722767157',
                appId: '1:866722767157:web:e0bd107d743ce1fc11ac7c',
                measurementId: 'G-SYTPBJSG2D'
            });
        }
        this.referenceMessages = firebase.firestore().collection('messages');
    }

    // Set navigation title as username
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        };
    };

    // Display elements
    componentDidMount() {
        NetInfo.fetch().then(state => {
            //console.log('Connection type', state.type);
            if (state.isConnected) {
                //console.log('Is connected?', state.isConnected);
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        try {
                            await firebase.auth().signInAnonymously();
                        } catch (error) {
                            console.log('Unable to sign in: ' + error.message);
                        }
                    }
                    this.setState({
                        isConnected: true,
                        user: {
                            _id: user.uid,
                            name: this.props.navigation.state.params.name,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                        messages: [],
                    });
                    //console.log(user);
                    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                });
            } else {
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    };

    // Stop listening for authentication and changes
    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
    };

    // Update the message state with input data 
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

    // Add message
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

    // Get messages from local(async) storage
    async getMessages() {
        let messages = [];
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // Save messages locally(asyncStorage)
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    };

    // Delete messages locally(asyncStorage)
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    };

    // Send message
    onSend = (messages = []) => {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => {
            this.addMessage();
            this.saveMessages();
        });
    };

    // Hide inputbar when offline
    renderInputToolbar(props) {
        if (this.state.isConnected) {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    };

    // Change message bubble color
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

    // Custom view display when the message contains location
    renderCustomView(props) {
        const { currentMessage } = props;
        //console.log(`currentMessage data:  ${JSON.stringify(currentMessage)}`);
        if (currentMessage?.location?.latitude && currentMessage?.location?.longitude) {
            //console.log('lat: ' + currentMessage.location.latitude, 'lon: ' + currentMessage.location.longitude);
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
    }

    // Render custom actions in inputToolbar
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
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
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
        width: 250,
        height: 200,
        borderRadius: 13,
        margin: 1,
        //width: Dimensions.get('window').width,
        //height: Dimensions.get('window').height,
    },
});
