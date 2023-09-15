import 'react-native-gesture-handler'
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import DropDownPicker from 'react-native-dropdown-picker'
import { useState } from 'react'
import COLORS from '../constants/colors'
import MyButton from '../components/MyButton'
import API from '../constants/api'

const AddNoteScreen = ({ navigation, route }) => {

    const data = route.params.data
    const user = {id: data.user.id, token: data.user.token}

    const catList = []

    data.categories.forEach(cat => {
        const item = { label: cat.name, value: cat.id }
        catList.push(item)
    });

    // States
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState(1)
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [categories, setCategories] = useState(catList)

    const addNote = async () => {
        const body = {user: user, note: {title: title, description: description, categories_id: category}}
        const res = await fetch(`${API.root}/notes/add`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .catch(e => console.error(e))

        if(res.success){
            Alert.alert("Success", "Note added")
            setTitle('')
            setDescription('')
            setCategory(1)
            return
        }
        Alert.alert("Error", "Something went wrong!")
    }

    return (
        <Pressable style={styles.container} onPress={() => {
            Keyboard.dismiss()
            setCategoryOpen(false)
        }}>
            <View style={styles.mainWrapper}>
                <Text style={styles.sectionTitle}>Add New Note</Text>
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Title: </Text>
                        <TextInput style={[styles.input, styles.textInput]} autoCorrect={false}
                            value={title}
                            onPressIn={() => setCategoryOpen(false)}
                            onChangeText={text => setTitle(text)}
                        />
                    </View>
                    <View style={[styles.field, { zIndex: 1 }]}>
                        <Text style={styles.label}>Category: </Text>
                        <DropDownPicker style={[styles.input]} autoCorrect={false}
                            containerStyle={styles.dropdown}
                            placeholder={"Select Category"}
                            placeholderStyle={{ fontSize: 16 }}
                            open={categoryOpen}
                            value={category}
                            items={categories}
                            setItems={setCategories}
                            setOpen={setCategoryOpen}
                            setValue={setCategory}
                        />
                    </View>
                    <View style={[styles.field, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                        <Text style={styles.label}>Description: </Text>
                        <TextInput style={[styles.input, styles.textArea]} autoCorrect={false} multiline={true}
                            value={description}
                            onPressIn={() => setCategoryOpen(false)}
                            onChangeText={text => setDescription(text)}
                        />
                    </View>
                </View>
                <View style={styles.buttonPanel}>
                    <MyButton title="Add" fontWeight='bold' width='80%' color={COLORS.white} onPress={addNote} />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
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
    form: {
        marginTop: 50,
        paddingTop: 20,
        paddingHorizontal: 20,
        height: '80%',
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: COLORS.black,
        paddingVertical: 10,
        width: 'auto',

        fontWeight: "bold"
    },
    input: {
        borderWidth: 0,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        borderColor: COLORS.black,
        fontSize: 15,
    },
    textInput: {
        flex: 1,
        height: '100%',
        height: 40,
    },
    textArea: {
        height: 200,
        textAlignVertical: 'top',
        width: '100%',
    },
    dropdown: {
        borderWidth: 0,
        width: '70%',
    },
    buttonPanel: {
        alignItems: 'center',
    },
    btnAdd: {
        height: 40,
    },
    btnAddText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default AddNoteScreen