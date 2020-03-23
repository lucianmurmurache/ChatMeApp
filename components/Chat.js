import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { View, StyleSheet, Platform } from 'react-native';

export default class Chat extends React.Component {
    state = {
        messages: [],
        user: {
            _id: '',
            name: '',
            avatar: ''
        },
    };

    //Set navigation title as username instead of "Chat"
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        }
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

    // Set state with a static message
    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello there!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    // Send message function
    onSend = (messages = []) => {
        this.setState(previousState => {
            const sentMessages = [{ ...messages[0], sent: true }]
            return {
                messages: GiftedChat.append(
                    previousState.messages,
                    sentMessages,
                ),
            }
        })
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
