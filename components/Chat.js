import React, { Component } from 'react';

import { StyleSheet, View, Text } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            user: ''
        }
    }

    // Place user's name in navigation
    // Don't know how to do that yet



    render() {
        return (
            <View style={styles.container}>
                <Text>Chat page..</Text>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        color: '#fff',
        fontSize: '16',
        alignItems: 'center',
        backgroundColor: '#000',
        justifyContent: 'center',
    },
})