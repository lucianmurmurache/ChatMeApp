import React, { Component } from 'react';
import { View, StyleSheet, Platform, AsyncStorage } from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';

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
            })
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
        NetInfo.fetch().then(isConnected => {
            if (isConnected) {
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        user: {
                            _id: this.user._id,
                            name: this.props.navigation.state.params.name,
                            loggedInText: this.props.navigation.state.params.name + ' has entered the chat',
                            isConnected: true,

                        },
                        messages: [],
                    });
                    console.log(user);
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
            });
        });
        this.setState({
            messages
        });
        //console.log(messages);
    };

    // Add message
    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            //user id ? : use uuid
        });
        console.log(this.state.user);
    };

    // Get messages from local(async) storage
    async getMessages() {
        let messages = '';
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
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
            this.saveMessages();
        });
    };

    componentWillUnmount() {
        // Stop listening for authentication
        this.authUnsubscribe();
        // Stop listening for changes
        this.unsubscribe();
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
        {/*
            * 
            * Idealy, to implement:
            * when the user is this.state.!isConnected,
            * the inputToolbar renders the keyboard, 
            * but the message is saved in this.saveMessages(); 
            * 
        */}
    }

    // Change bubble color
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

    render() {
        return (
            <View style={[
                styles.container, {
                    backgroundColor: this.props.navigation.state.params.color
                }
            ]}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    user={this.state.user}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Sets the width and height of the device
        color: '#FFFFFF',
        backgroundColor: '#000000',
    },
});
