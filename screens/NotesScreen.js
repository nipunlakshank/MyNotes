import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Note from '../components/Note';
import { useCallback, useState } from 'react';
import COLORS from '../constants/colors';
import { API } from '../constants/app';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from './LoadingScreen';

const NotesScreen = ({ navigation, route }) => {

  const user = route.params.data.user

  const hideDeleteButton = {
    opacity: 0,
  }
  const showDeleteButton = {
    opacity: 1,
  }

  // states
  const [selectedItems, setSelectedItems] = useState(new Set([]))
  const [deleteButtonStyle, setDeleteButtonStyle] = useState(hideDeleteButton)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [noteList, setNoteList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const subscribe = () => {
        const body = { users_id: user.id, token: user.token }
        fetch(`${API.root}/notes/get`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
          .then(res => res.json())
          .then(json => {
            setNoteList(json)
            setIsLoading(false)
          })
          .catch(e => console.error(e))
      }
      console.log('Notes list re-rendered')
      subscribe()
      return () => { };
    }, [])
  )

  if (isLoading) {
    return <LoadingScreen />
  }

  const addItem = (id) => {
    setSelectedItems(new Set([...Array.from(selectedItems), id]))
    if (selectedItems.size === 0) {
      setDeleteButtonDisabled(false)
      setDeleteButtonStyle(showDeleteButton)
    }
  }

  const removeItem = (id) => {
    const arr = Array.from(selectedItems)
    const index = arr.indexOf(id)
    if (index > -1) {
      arr.splice(index, 1)
    }
    const newItems = new Set([...arr])
    setSelectedItems(newItems)
    if (newItems.size === 0) {
      setDeleteButtonStyle(hideDeleteButton)
      setDeleteButtonDisabled(true)
    }
  }

  const deleteNotes = async () => {
    const res = await fetch(`${API.root}/notes/delete`, {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users_id: user.id, token: user.token, ids: Array.from(selectedItems) })
    })
      .then(res => res.json())
      .catch(e => console.error(e))

    if (res.success) {
      Alert.alert("Success", "Notes deleted!")
      setNoteList(res.notes)
      setDeleteButtonDisabled(true)
      setDeleteButtonStyle(hideDeleteButton)
      setSelectedItems(new Set([]))
      return
    }
    Alert.alert("Error", "Something went wrong!")
  }

  const deleteNotesHandler = () => {
    Alert.alert('Warning', 'Are you sure you want delete selected notes?', [
      {
        text: 'Cancel',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: deleteNotes,
      },
    ], { cancelable: true })
  }

  if (noteList.length === 0)
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.mainWrapper}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={[styles.notesList, { height: '80%', alignItems: 'center', justifyContent: 'center' }]}>
            {/* This is where the notes go! */}
            <Text>No notes found</Text>
          </View>
        </View>
      </View>
    )


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.mainWrapper}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={[styles.btnDelete, deleteButtonStyle]} >
          <Button title='Delete' color={COLORS.danger} hitSlop={100}
            disabled={deleteButtonDisabled}
            onPress={deleteNotesHandler}
          />
        </View>
        <View style={styles.notesList}>
          {/* This is where the notes go! */}
          <FlatList data={noteList}
            renderItem={({ item }) => <Note data={item} addItem={addItem} removeItem={removeItem} />}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7EAEC',
  },
  mainWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  notesList: {
    marginTop: 30,
    marginBottom: 150,
  },
  btnDelete: {
    alignSelf: 'flex-end',
  },
});

export default NotesScreen
