import React, { Component } from 'react';

import { View, Text, StyleSheet, } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            color: '',
        }
    }

    //Set title as username
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        }
    }

    render() {
        return (
            <View style={[
                styles.container, {
                    backgroundColor: this.props.navigation.state.params.color
                }
            ]}
            >
                <Text>Chat page..</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        fontSize: 16,
        width: '100%',
        color: '#fff',
        alignItems: 'center',
        backgroundColor: '#000',
        justifyContent: 'center',
    },
});
