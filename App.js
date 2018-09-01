import React from 'react';
import { StyleSheet, View, ScrollView, Switch, TextInput, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const DONE = 'Done';
const NOT_DONE = 'NotDone';
const NOTES_STORAGE_KEY = 'notes';

export default class App extends React.Component {
    state = {
        notes: [],
        filter: NOT_DONE,
        newNoteText: '',
        editElement: {
            newNoteText: '',
            index: 0
        }
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

    onElementEdit = (newNoteText, index) => {
        this.setState({
            editElement: {
                newNoteText,
                index
            }
        });
    };

    onElementSubmit = () => {
        this.setState(prevState => {
            const notes = prevState.notes;
            notes[prevState.editElement.index].message = prevState.editElement.newNoteText;
            notes[prevState.editElement.index].creationDate = new Date().toLocaleTimeString();
            AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));

            return {
                notes,
                editElement: {
                    newNoteText: '',
                    index: 0
                }
            };
        });
    };

    removeElement = index => {
        this.setState(prevState => {
            const notes = prevState.notes;
            notes.splice(index, 1);
            AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));

            return { notes };
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    value={this.state.newNoteText}
                    placeholder="Add note"
                    onSubmitEditing={this.onInputSubmit}
                    onChangeText={this.onInputChange}
                    autoFocus
                />
                <Switch value={this.state.filter === DONE} onValueChange={this.onSwitchStatus} />
                <ScrollView>
                    {this.state.notes.filter(note => note.isDone === this.state.filter).map((note, index) => (
                        <View key={index}>
                            <TextInput
                                value={note.message}
                                onChangeText={value => this.onElementEdit(value, index)}
                                onSubmitEditing={this.onElementSubmit}
                            />
                            <TouchableWithoutFeedback onPress={() => this.removeElement(index)}>
                                <Ionicons name="md-close" size={12} color="red" />
                            </TouchableWithoutFeedback>
                        </View>
                    ))}
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
    }
});
