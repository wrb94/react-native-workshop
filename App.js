import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Switch,
    TextInput,
    AsyncStorage,
    TouchableWithoutFeedback,
    Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const DONE = 'Done';
const NOT_DONE = 'NotDone';
const NOTES_STORAGE_KEY = 'notes';
const NOTES_UPDATE = 'NOTES_UPDATE';

class HomeScreen extends React.Component {
    state = {
        notes: [],
        newNoteText: '',
        action: ''
    };

    componentDidUpdate() {
        if (this.state.action === NOTES_UPDATE)
            AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.state.notes)).then(this.changeView);
    }

    async componentDidMount() {
        try {
            const notes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
            this.setState({ notes: JSON.parse(notes) || [] });
        } catch (e) {
            console.log(e);
        }
    }

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
            newNoteText: '',
            action: NOTES_UPDATE
        }));
    };

    changeView = () => {
        this.props.navigation.navigate('Items', this.state.notes);
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
                <Button color="blue" onPress={this.changeView} title="Go to notes" />
            </View>
        );
    }
}

class ItemsScreen extends React.Component {
    state = {
        notes: [],
        filter: NOT_DONE,
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

            return { notes };
        });
    };

    goBack = () => {
        AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.state.notes)).then(this.props.navigation.goBack);
    };

    render() {
        return (
            <View style={styles.container}>
                <Button title="Go back" onPress={this.goBack} />
                <Switch value={this.state.filter === DONE} onValueChange={this.onSwitchStatus} />
                <ScrollView>
                    {this.state.notes.filter(note => note.isDone === this.state.filter).map((note, index) => (
                        <View key={index} style={styles.noteContainer}>
                            <TextInput
                                style={styles.noteInputContainer}
                                value={note.message}
                                onChangeText={value => this.onElementEdit(value, index)}
                                onSubmitEditing={this.onElementSubmit}
                            />
                            <TouchableWithoutFeedback onPress={() => this.removeElement(index)}>
                                <Ionicons name="md-close" size={18} color="red" style={styles.removeIconContainer} />
                            </TouchableWithoutFeedback>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const Navigator = StackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Items: {
            screen: ItemsScreen
        }
    },
    {
        initialRouteName: 'Home'
    }
);

export default class App extends React.Component {
    render() {
        return <Navigator />;
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noteContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noteInputContainer: {
        paddingRight: 10
    },
    removeIconContainer: {
        paddingTop: 1
    }
});
