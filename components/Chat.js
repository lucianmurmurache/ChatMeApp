import React from 'react';

import { View, Text, StyleSheet, } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();
    }

    //Set title as username
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name
        }
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.color }]}>
                <Text style={styles.text}>Chat page...</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
    }
});
