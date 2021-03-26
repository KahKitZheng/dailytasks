import React, { useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// Disables timer warning
import { LogBox } from "react-native";

// Import Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";

LogBox.ignoreLogs(["Setting a timer"]);

const Stack = createStackNavigator();

const AuthContext = React.createContext();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_USER":
          return {
            ...prevState,
            user: action.payload,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignOut: false,
            user: action.payload,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignOut: true,
            user: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      user: null,
    }
  );

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      // if already initialized, use that one
      firebase.app();
    }

    const bootstrapAsync = async () => {
      let user;

      try {
        user = await SecureStore.getItemAsync("user");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_USER", user: user });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await firebase
          .auth()
          .signInWithEmailAndPassword(data.email, data.password)
          .then((res) => {
            dispatch({ type: "SIGN_IN", payload: res });
          })
          .catch((error) => {
            console.error(error);
          });
      },
      signOut: async () => {
        firebase.auth().signOut();
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        const db = firebase.firestore();
        const { email, password } = data;
        let newUser = {};

        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            newUser = authUser;
            return db
              .doc(`users/${authUser.user.uid}`)
              .set({ email }, { merge: true });
          })
          .then(() => {
            return dispatch({ type: "SIGN_IN", payload: newUser });
          });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.user == null ? (
            <>
              <Stack.Screen name="Sign In" component={SignInScreen} />
              <Stack.Screen name="Sign Up" component={SignUpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export { AuthContext };
