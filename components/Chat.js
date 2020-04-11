import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


import firebase from 'firebase';
import 'firebase/firestore';

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
        }
    }

    // Set user ID, name and avatar 
    setUser = (_id, name = 'anonymous') => {
        this.setState({
            user: {
                _id: _id,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
                loggedInText: '',
            },
        });
    }

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
    };

    // Add message
    addMessage(message) {
        this.referenceMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
        });
    }

    // Send message
    onSend = (messages = []) => {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
        });
    }

    // Display elements
    componentDidMount() {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            if (this.props.navigation.state.params.name) {
                this.setUser(user._id, this.props.navigation.state.params.name);
            } else {
                this.setUser({
                    _id: user._id,
                    loggedInText: 'Hello there',
                });
            }
        });
        this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);

        // Set state with a static message
        this.setState({
            messages: [
                {
                    _id: 2,
                    text: this.props.navigation.state.params.name + ' has entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    componentWillUnmount() {
        // Stop listening for authentication
        this.authUnsubscribe();
        // Stop listening for changes
        this.unsubscribe();
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
        )
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.color }]}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={this.renderBubble.bind(this)}
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
