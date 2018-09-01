import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput } from 'react-native';
import { Constants } from 'expo';

const DONE = 'Done';
const NOT_DONE = 'NotDone';

export default class App extends React.Component {
    state = {
        // notes: new Array(5).fill(0).map((_, index) => ({
        //     message: `Note ${index + 1}`,
        //     isDone: Math.random() > 0.5 ? DONE : NOT_DONE,
        //     creationDate: new Date().toLocaleTimeString()
        // })),
        notes: [],
        filter: DONE,
        newNoteText: ''
    };

    onSwitchStatus = () => {
        this.setState(prevState => ({
            filter: prevState.filter === DONE ? NOT_DONE : DONE
        }));
    };

    onInputChange = newText => {
        this.setState({ newNoteText: newText });
    };

    onInputSubmit = () => {
        this.setState(prevState => ({
            notes: prevState.notes.concat({
                message: prevState.newNoteText,
                isDone: NOT_DONE,
                creationDate: new Date().toLocaleTimeString()
            }),
            newNoteText: ''
        }));
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    value={this.state.newNoteText}
                    placeholder="Add note"
                    onSubmitEditing={this.onInputSubmit}
                    onChangeText={this.onInputChange}
                />
                <Switch value={this.state.filter === DONE} onValueChange={this.onSwitchStatus} />
                <ScrollView>
                    <View>
                        {this.state.notes.filter(note => note.isDone === this.state.filter).map((note, index) => (
                            <Text key={index} style={note.isDone === DONE ? styles.doneTask : styles.notDoneTask}>
                                {`${index + 1}. ${note.message}  ${note.creationDate}`}
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    doneTask: {
        color: 'green'
    },
    notDoneTask: {
        color: 'red'
    }
});
