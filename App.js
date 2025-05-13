import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...");

  const ask = async () => {
    // 권한 요청
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setCity(location[0].city);
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        // indicatorStyle="white"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#24273A",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 64,
    fontWeight: 500,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 128,
  },
  description: {
    color: "white",
    marginTop: -30,
    fontSize: 64,
  },
});
