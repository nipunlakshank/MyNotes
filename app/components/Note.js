import { useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import COLORS from "../constants/colors"


const Note = (props) => {
    const note = props.data
    const img = note.img !== '' ? note.img : 'https://img.icons8.com/fluency/48/help.png'
    const addItem = props.addItem ? props.addItem : item => {return}
    const removeItem = props.removeItem ? props.removeItem : item => {return}

    const defaultSelectorStyle = {
        backgroundColor: 'transparent',
        borderColor: '#424444',
    }

    const activeSelectorStyle = {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.highlight,
    }

    const defaultTitleStyle = {
        fontWeight: 'normal'
    }
    const activeTitleStyle = {
        fontWeight: 'bold'
    }

    const defaultBodyStyle = {
        display: 'none'
    }
    const activeBodyStyle = {
        display: 'flex'
    }

    const defaultItemStyle = {
        borderWidth: 0,
    }
    const activeItemStyle = {
        borderWidth: 1,
        borderColor: COLORS.highlight,
    }

    const [itemStyle, setItemStyle] = useState(defaultItemStyle)
    const [bodyStyle, setBodyStyle] = useState(defaultBodyStyle)
    const [bodyVisible, setBodyVisible] = useState(false)
    const [selectorStyle, setSelectorStyle] = useState(defaultSelectorStyle)
    const [selected, setSelected] = useState(false)
    const [titleStyle, setTitleStyle] = useState(defaultTitleStyle)

    const select = () => {
        if (selected) {
            setSelectorStyle(defaultSelectorStyle)
            setSelected(false)
            removeItem(note.id)
            return
        }
        setSelectorStyle(activeSelectorStyle)
        setSelected(true)
        addItem(note.id)
    }

    return (
        <View style={[styles.item, itemStyle]}>
            <Pressable style={styles.card} onPress={() => {
                if (bodyVisible) {
                    setItemStyle(defaultItemStyle)
                    setBodyStyle(defaultBodyStyle)
                    setTitleStyle(defaultTitleStyle)
                    setBodyVisible(false)
                    return
                }
                setItemStyle(activeItemStyle)
                setBodyStyle(activeBodyStyle)
                setTitleStyle(activeTitleStyle)
                setBodyVisible(true)
            }}>
                <View style={styles.itemLeft}>
                    <View style={styles.noteIcon}>
                        <Image style={styles.catImg} source={{ uri: img }} />
                    </View>
                    <View style={styles.itemText}>
                        <Text style={[styles.itemTitle, titleStyle]}>{note.title}</Text>
                    </View>
                </View>
                <Pressable style={[styles.circular, selectorStyle]} hitSlop={10} onPress={select}></Pressable>
            </Pressable>

            <Text style={styles.itemDate}>{note.created_at}</Text>

            <View style={[styles.itemBody, bodyStyle]}>
                <Text style={styles.noteCategory}>Category: {note.category}</Text>
                <Text style={styles.noteDesc}>{note.description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginVertical: 5,
        minHeight: 60,
        flexWrap: 'wrap',
    },
    card: {
        padding: 15,
        minHeight: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    itemLeft: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    noteIcon: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.bg_highlight,
        borderRadius: 5,
        marginRight: 15,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    catImg: {
        width: 40,
        height: 40,
    },
    itemText: {
        maxWidth: '75%',
    },
    itemTitle: {
        color: '#424444',
        fontSize: 16,
    },
    itemDate: {
        color: COLORS.warning,
        fontSize: 13,
        alignSelf: 'flex-end',
        paddingRight: 20,
        paddingBottom: 10,
    },
    itemBody: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 20,
    },
    noteCategory: {
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: 13,
    },
    noteDesc: {
        fontSize: 14,
    },
    circular: {
        alignSelf: 'flex-end',
        width: 15,
        height: 15,
        borderWidth: 2,
        borderRadius: 20,
    },
})

export default Note