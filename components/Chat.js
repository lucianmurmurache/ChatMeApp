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
            uid: 0,
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

    setUser = (_id, name = 'anonymous') => {
        this.setState({
            user: {
                _id: _id,
                name: name,
                avatar: 'https://placeimg.com/140/140/any'
            }
        });
    }

    //Get user data
    get user() {
        return {
            name: this.props.navigation.state.params.name,
            _id: this.state.uid,
            id: this.state.uid,
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Go through each document
        querySnapshot.forEach(doc => {
            // Get queryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.Date,
                user: data.user
            });
        });
        this.setState({
            messages
        });
    };

    // Add message
    addMessage() {
        this.referenceMessages.add({
            _id: this.state.messages[0]._id,
            text: this.state.messages[0].text || '',
            createdAt: this.state.messages[0].createdAt,
            user: this.state.messages[0].user,
            uid: this.state.uid,
        });
    }

    // Send message
    onSend = (messages = []) => {
        this.setState(previousState => {
            const sentMessages = [
                { ...messages[0], sent: true }
            ]
            return {
                messages: GiftedChat.append(
                    previousState.messages,
                    sentMessages,
                ),
            }
        })
    }

    // Display elements
    componentDidMount() {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            if (this.props.navigation.state.params.name) {
                this.setUser(user.uid, this.props.navigation.state.params.name);
            } else {
                this.setUser({
                    uid: user.uid,
                    loggedInText: 'Hello there',
                });
            }

            this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        });
        // Set state with a static message
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
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
        {/* Quick choices:
           * #0E3B43 // Warm Black
           * #357266 // Myrtle Green
           * #A3BBAD // Cambridge Blue
           * #65532F // Donkey Brown
           * #312509 // Zinnwaldite Brown
           * #585563 // Davy's Grey
           * #5B2E48 // Wine Dregs  
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

{/*

    *Ongoing issue:
    *
    * The app loads, enter name, select colour, enter chat successful, 
    * L134 message appears briefly, then the Firebase messages load,
    * Unable to type, the keyboard appears and disappears immediately,
    * Still looking for fix.

*/}
