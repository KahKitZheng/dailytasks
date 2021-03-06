import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import Layout from "./Layout";
import ListCard from "../components/ListCard";
import AddListModal from "../components/AddListModal";
import { Feather } from "@expo/vector-icons";
import { getToday } from "../utils/date";
import { getUserFromFireStore, getUserList, deleteList } from "../firebase/api";

export default function ListScreen({ navigation }) {
  const [dataFetched, setDataFetched] = useState(false);
  const [renderScreen, setRenderScreen] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [userLists, setUserLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const today = getToday();

  useEffect(() => {
    getUserFromFireStore().then((user) => {
      setDisplayName(user.displayName);
      setDataFetched(true);
    });

    dataFetched ? setRenderScreen(true) : null;
  }, [dataFetched, renderScreen]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserList().then((res) => setUserLists(res));
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { elevation: 0, backgroundColor: "#FFCD2D" },
      headerRight: () => (
        <Pressable onPress={() => setModalVisible(true)}>
          <Feather
            name="plus"
            size={24}
            color="#000"
            style={styles.headerRight}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  function handleDeleteList(listID) {
    let filtered = userLists.filter((list) => list.id !== listID);

    deleteList(listID);
    setUserLists(filtered);
  }

  return (
    <Layout
      title={`Hello, ${displayName}`}
      underTitle={today}
      header={true}
      pointerEvents="none"
    >
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddListModal
          closeModal={() => {
            getUserList().then((res) => setUserLists(res));
            setModalVisible(false);
          }}
        />
      </Modal>
      {renderScreen && userLists.length === 0 ? (
        <View style={styles.emptyPlaceholder}>
          <Text style={styles.placeholderText}>
            Use the + icon to add new lists
          </Text>
        </View>
      ) : (
        <FlatList
          data={userLists}
          keyExtractor={(item) => item.id}
          style={styles.cardList}
          renderItem={({ item }) => (
            <ListCard
              list={item}
              navigation={navigation}
              handleDeleteList={handleDeleteList}
            />
          )}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardList: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: "#C0C0C0",
  },
  headerRight: {
    paddingRight: 12,
  },
});
