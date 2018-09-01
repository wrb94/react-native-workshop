import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput, AsyncStorage } from 'react-native';
import { Constants } from 'expo';

const DONE = 'Done';
const NOT_DONE = 'NotDone';
const NOTES_STORAGE_KEY = 'notes';

export default class App extends React.Component {
    state = {
        notes: [],
        filter: DONE,
        newNoteText: ''
    };

    async componentDidMount() {
        try {
            const notes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
            this.setState({ notes: JSON.parse(notes) || [] });
        } catch (e) {
            console.log(e);
        }
    }

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
        AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.state.notes));
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
