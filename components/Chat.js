import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { View, StyleSheet, Platform } from 'react-native';

import firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends React.Component {

    constructor() {
        super();

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

        this.referenceMessageUser = null;
        this.referenceMessages = firebase.firestore().collection('messages')

        this.state = {
            messages: [],
            uid: 0,
            loggedInText: 'Processing authentication, please wait!',
        };
    }

    //Set navigation title as username
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        }
    }

    //Get user name and id
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
                createdAt: data.createdAt.toDate(),
                user: data.user
            });
        });
        this.setState({
            messages
        });
    };

    addMessage() {
        console.log(this.state.messages[0])
        this.referenceMessages.add({
            _id: this.state.messages[0]._id,
            text: this.state.messages[0].text || '',
            createdAt: this.state.messages[0].createdAt,
            user: [this.state.uid, this.props.navigation.state.params.name, ''],
            uid: this.state.uid,
        });
    }

    onSend(messages = []) {
        this.setState(
            previousState => ({
                messages: GiftedChat.append(previousState.messages, messages)
            }),
            () => {
                this.addMessage();
            }
        );
    }

    componentDidMount() {
        // Listen for authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
            // Update user state with current user data
            this.setState({
                uid: user.uid,
                loggedInText: 'Hello there!'
            });
            // Create reference to the active user's data
            this.referenceMessageUser = firebase.firestore().collection('messages');
            // Listen for collection changes to current user
            this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);
        });
        this.setState({
            messages: [
                {
                    _id: 2,
                    text: this.props.navigation.state.params.name + ' has entered the chat!',
                    createdAt: new Date(),
                    system: true,
                }
            ]
        })
    }

    componentWillUnmount() {
        // Stop listening for authentication
        this.authUnsubscribe();
        // Stop listening for changes
        this.unsubscribeMessageUser();
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
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        )
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
    ===============
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src='https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js'></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src='https://www.gstatic.com/firebasejs/7.13.2/firebase-analytics.js'></script>

    <script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyBq-QCkcxewGL-E4bI6dFqeJ70qEqc9hxM',
      authDomain: 'chatmeapp-a125c.firebaseapp.com',
      databaseURL: 'https://chatmeapp-a125c.firebaseio.com',
      projectId: 'chatmeapp-a125c',
      storageBucket: 'chatmeapp-a125c.appspot.com',
      messagingSenderId: '866722767157',
      appId: '1:866722767157:web:e0bd107d743ce1fc11ac7c',
      measurementId: 'G-SYTPBJSG2D'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    </script>
*/}
