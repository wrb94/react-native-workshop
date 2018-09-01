import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { Constants } from 'expo';

const DONE = 'Done';
const NOT_DONE = 'NotDone';

export default class App extends React.Component {
    state = {
        notes: new Array(100).fill(0).map((_, index) => ({
            message: `Note ${index + 1}`,
            isDone: Math.random() > 0.5 ? DONE : NOT_DONE,
            creationDate: this.getCreationDate()
        })),
        filter: DONE
    };

    onSwitchStatus = () => {
        this.setState(prevState => ({
            filter: prevState.filter === DONE ? NOT_DONE : DONE
        }));
    };

    getCreationDate() {
        const today = Math.random() > 0.5;
        const date = new Date();
        let day = date.getDate();
        if (!today) --day;
        date.setDate(day);

        return date.toLocaleDateString();
    }

    render() {
        return (
            <View style={styles.container}>
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
