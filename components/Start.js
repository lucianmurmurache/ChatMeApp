import React, { Component } from 'react';

import {
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

export default class Start extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            color: ''
        }
    }

    render() {
        return (
            <ImageBackground
                source={require('../assets/BackgroundImage.png')}
                style={styles.backgroundImage}
            >
                <Text style={styles.appTitle}>ChatMeApp</Text>

                <View style={styles.container}>

                    {/*Name input section*/}
                    <TextInput
                        value={this.state.name}
                        placeholder='Your name..'
                        styles={styles.nameContainer}
                        onChangeText={(name) => this.setState({ name })}
                    />

                    {/*Chat background color selector*/}
                    <Text style={styles.text}>
                        Choose Background Color:
                    </Text>
                    <View style={styles.colorOptions}>
                        <TouchableHighlight
                            onPress={() => this.setState({ color: '#090C08' })}
                            style={[styles.colorButtons, styles.colorOption1]}
                        />

                        <TouchableHighlight
                            onPress={() => this.setState({ color: '#474056' })}
                            style={[styles.colorButtons, styles.colorOption2]}
                        />

                        <TouchableHighlight
                            onPress={() => this.setState({ color: '#8A95A5' })}
                            style={[styles.colorButtons, styles.colorOption3]}
                        />

                        <TouchableHighlight
                            onPress={() => this.setState({ color: '#B9C6AE' })}
                            style={[styles.colorButtons, styles.colorOption4]}
                        />
                    </View>

                    <Button
                        style={styles.button}
                        title='Start Chatting'
                        onPress={() =>
                            this.props.navigation.navigate('Chat',
                                {
                                    name: this.state.name,
                                    color: this.state.color
                                }
                            )}
                    />

                </View>
            </ImageBackground>
        );
    }
}

/*==========Styling==========*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '88%',
        fontSize: 16,
        height: '44%',
        color: '#000',
        alignItems: 'center',
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: '#757083',
        fontWeight: '300',
    },
    appTitle: {
        color: '#fff',
        fontSize: '45',
        fontWeight: '600',
        textAlign: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    nameContainer: {
        fontSize: 16,
        width: '88%',
        borderWidth: 1,
        opacity: '50%',
        color: '#757083',
        fontWeight: '600',
        borderColor: '#000',
    },
    button: {
        fontSize: 16,
        width: '88%',
        color: '#fff',
        fontWeight: '600',
        backgroundColor: '#757083',
    },
    /*==========ColorOptions==========*/
    colorOptions: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    colorButtons: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    colorOption1: {
        backgroundColor: '#090C08',
    },
    colorOption2: {
        backgroundColor: '#474056',
    },
    colorOption3: {
        backgroundColor: '#8A95A5',
    },
    colorOption4: {
        backgroundColor: '#B9C6AE',
    }
});
