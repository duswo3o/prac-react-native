import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fontisto from "@expo/vector-icons/Fontisto";
import Checkbox from "expo-checkbox";
import Feather from "@expo/vector-icons/Feather";

const STORAGE_KEY = "@toDos";
const LAST_VIEW = "@lastView";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [isEdit, setIsEdit] = useState(null);
  const [editText, setEditText] = useState("");

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(LAST_VIEW, "false");
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(LAST_VIEW, "true");
  };
  const getLastView = async () => {
    const lastView = await AsyncStorage.getItem(LAST_VIEW);
    lastView === "true" ? setWorking(true) : setWorking(false);
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: async () => {
          const newTodos = { ...toDos };
          delete newTodos[key];
          setToDos(newTodos);
          await saveToDos(newTodos);
        },
      },
    ]);
  };

  const doneToDo = (key) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], done: !toDos[key].done },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const onEditText = (payload) => setEditText(payload);
  const editToDo = (key) => {
    Alert.alert("Edit To Do", "Are you done?", [
      { text: "Cancel", onPress: () => setIsEdit(null) },
      {
        text: "done",
        onPress: async () => {
          if (editText === "") {
            return;
          }
          const newToDos = {
            ...toDos,
            [key]: { ...toDos[key], text: editText },
          };
          setToDos(newToDos);
          await saveToDos(newToDos);
          setIsEdit(null);
        },
      },
    ]);
  };

  useEffect(() => {
    loadToDos();
    getLastView();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <View style={styles.toDoComponent}>
                <Checkbox
                  value={toDos[key].done}
                  onValueChange={() => doneToDo(key)}
                />
                {isEdit !== key ? (
                  <Text
                    style={toDos[key].done ? styles.doneText : styles.toDoText}
                  >
                    {toDos[key].text}
                  </Text>
                ) : (
                  <TextInput
                    onSubmitEditing={() => editToDo(key)}
                    onChangeText={onEditText}
                    value={editText}
                    autoFocus
                  />
                )}
              </View>
              <View style={styles.toDoComponent}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEdit(key);
                    setEditText(toDos[key].text);
                  }}
                >
                  <Feather name="edit" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
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
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 32,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  toDoComponent: {
    flexDirection: "row",
    gap: 20,
  },
});
