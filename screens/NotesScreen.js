import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Note from '../components/Note';
import { useCallback, useState } from 'react';
import COLORS from '../constants/colors';
import { API } from '../constants/app';
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    useCallback(() => {
      const subscribe = () => {
        const body = {users_id: user.id, token: user.token}
        fetch(`${API.root}/notes/get`,{
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(json => {
          console.log("reloaded.\nnotes:\n", json)
          setNoteList(json)
        })
        .catch(e => console.error(e))
      }
      console.log('reloaded')
      subscribe()
      return () => {};
    }, [setNoteList, user])
  )


  const addItem = (id) => {
    setSelectedItems(new Set([...Array.from(selectedItems), id]))
    if (selectedItems.size === 0) {
      setDeleteButtonDisabled(false)
      setDeleteButtonStyle(showDeleteButton)
    }
    console.log(selectedItems)
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
    console.log(selectedItems)
  }

  const deleteNotes = async () => {
    const res = await fetch(`${API.root}/notes/delete`)
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
    ], {
      cancelable: true,
    })
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
          <Button style={styles.btnDeleteText} title='Delete' color={COLORS.danger} hitSlop={100}
            disabled={deleteButtonDisabled}
            onPress={deleteNotesHandler}
          />
        </View>
        <View style={styles.notesList}>
          {/* This is where the notes go! */}
          <FlatList data={noteList} extraData={noteList}
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
  btnDeleteText: {
    // color: COLORS.danger,
    // fontSize: 18,
  },
});

export default NotesScreen
