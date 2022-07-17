import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons'; 
import { theme } from "./colors"

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState("")
  const [toDos, setTodos] = useState({})

  useEffect(() => {
    loadTodo()
  }, [])

  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }

  const loadTodo = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setTodos(JSON.parse(s))
  }

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    // const newToDos = {...toDos, [Date.now()]: {text, work: working} }
    const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, working: working}
    })
    setTodos(newToDos)
    await saveToDos(newToDos)
    setText("")
  }

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {text: "Cancel"},
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = {...toDos}
          delete newToDos[key]
          setTodos(newToDos)
          await saveToDos(newToDos)
      }}
    ])
    return
    
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>          
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        returnKeyType="done"
        placeholder={working ? "Add a To Do" : "where do you want go?"}
        value={text} 
        style={styles.input} 
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => 
         toDos[key].working === working ? <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <AntDesign name="delete" size={20} color="red" />
            </TouchableOpacity>
        </View> : null
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
