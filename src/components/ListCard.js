import React, { useState } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { Ionicons } from "@expo/vector-icons";
import { BaseButton } from "react-native-gesture-handler";

export default function ListCard(props) {
  const { id, title, color } = props.list;

  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  const getCardSize = (event) => {
    const { width, height } = event.nativeEvent.layout;

    setCardWidth(width);
    setCardHeight(height - 6);
  };

  const sendListDetails = () =>
    props.navigation.navigate("List Details", {
      id,
      listTitle: title,
      listColor: color,
    });

  const renderRightActions = () => (
    <BaseButton rippleColor="#fff" onPress={() => props.handleDeleteList(id)}>
      <View style={styles.iconDelete}>
        <Ionicons name="close-sharp" size={24} color={"#000"} />
      </View>
    </BaseButton>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Shadow
        startColor="#00000010"
        distance={8}
        offset={[24, 7]}
        size={[cardWidth, cardHeight]}
      >
        <TouchableWithoutFeedback
          activeOpacity={0.4}
          onPress={() => sendListDetails()}
        >
          <View style={styles.wrapper}>
            <View
              style={[
                styles.accentBorder,
                { borderColor: color, backgroundColor: color },
              ]}
            />
            <View
              style={[styles.container, { borderLeftColor: color }]}
              onLayout={(event) => getCardSize(event)}
            >
              <Text style={styles.cardTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Shadow>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    paddingTop: 4,
    paddingHorizontal: 20,
  },
  accentBorder: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderWidth: 4,
    height: 100,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    height: 100,
    backgroundColor: "#fff",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "700",
  },
  iconDelete: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    paddingRight: 15,
  },
});
