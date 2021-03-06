import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { addSubList } from "../firebase/api";

export default function AddSubListModal(props) {
  const { listID, defaultColor, closeModal } = props;
  const [subListTitle, setSubListTitle] = useState("");
  const [subListColor, setSubListColor] = useState(defaultColor);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
        <Ionicons name="close-sharp" size={24} color={"#000"} />
      </TouchableOpacity>

      <View style={styles.main}>
        <Text style={styles.title}> Create a sub list </Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={subListTitle}
          onChangeText={(text) => setSubListTitle(text)}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: subListColor }]}
          onPress={() => {
            const newSubList = { listID, subListTitle, subListColor };
            addSubList(listID, newSubList);
            closeModal();
          }}
        >
          <Text style={styles.buttonText}>Create!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  main: {
    alignSelf: "stretch",
    marginHorizontal: 32,
  },
  title: {
    alignSelf: "center",
    color: "#000",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  label: {
    marginTop: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#24A6D9",
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  colorList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    height: 50,
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
