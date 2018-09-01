import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Constants } from 'expo';

export default class App extends React.Component {
    state = {
        notes: new Array(100).fill(0).map((_, index) => `Note ${index}`)
    };

    render() {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    {this.state.notes.map((note, index) => (
                        <Text key={index}>{note}</Text>
                    ))}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollView: {
        paddingTop: Constants.statusBarHeight
    }
});
