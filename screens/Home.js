import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import Avatar from 'react-avatar';

const db = SQLite.openDatabase("little_lemon");

function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [starterActive, setStarterActive] = useState(false);
  const [mainsActive, setMainsActive] = useState(false);
  const [desertsAcitve, setDesertsActive] = useState(false);
  const [drinks, setDrinks] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    (async () => {
      let menuItems = [];
      await createTable();
      menuItems = await getMenuItemsFromDatabase();
      if (!menuItems) {

        menuItems = await getMenuData();
        saveMenuItems(menuItems);
        //menuItems = await getMenuItemsFromDatabase();
        console.log(menuItems);
        setData(menuItems);
        setInitialData(menuItems);
      } else {
        setData(menuItems);
        setInitialData(menuItems);
      }
      console.log(menuItems)
    })();
  }, []);

  useEffect(() => {
    filterByCategory(selectedCategories)
  }, [selectedCategories]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterByDishName(searchText);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchText])

  const filterByDishName = (searchText) => {
    if (searchText) {
      let res = [];
      res = data.filter(item => 
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
      console.log(res);
      setData(res);
    }
  }

  const handleCategoryPress = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const filterByCategory = (categories) => {
    if (categories.length === 0) {
      setData(initialData);
    } else {
    let placeholders = '';
    let categoryValues = [];
    for (let i = 0; i < categories.length; i++) {
      placeholders += (i !== 0 ? ', ' : '') + '?';
      categoryValues.push(categories[i]);
    }
    let res = [];
    res = data.filter(item => categoryValues.includes(item.category));
    console.log(res);
    setData(res);
  }
  }

  async function createTable() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists menu (id integer primary key AUTOINCREMENT, name text, price text, description text, image text, category text);",
          [],
          () => {
            resolve();
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  function saveMenuItems(menuItems) {
    try {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into menu (name, price, description, image, category) values ${menuItems
          .map(
            (item) =>
              `("${item.name}", "${item.price}", "${item.description}","${item.category}", "${item.image}")`
          )
          .join(", ")}`
      );
    });
  } catch (error) {
    console.error(error);
  }
  }

  async function getMenuData() {
    try {
      console.log("raw");
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const json = await response.json();
      console.log(json);
      const menuData = json.menu;
      return menuData;
    } catch (error) {
      console.error(error);
    }
  }

  async function getMenuItemsFromDatabase() {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM menu", [], (_, { rows }) => {
          resolve(rows._array);
        });
      });
    });
  }

  function RenderMenuItem({ item }) {
    return (

      <View style={{ marginLeft: "5%", flex: 1 }}>
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 22,
            marginVertical: "3%",
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", flexWrap: "wrap", flex: 1 }}>
            {item.description}
          </Text>
          <Image
            source={{
              uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
            }}
            style={{ width: 150, height: 150, marginRight: "5%" }}
          />
        </View>
        <Text style={{ fontSize: 22 }}>${item.price}</Text>
        <View
          style={{
            borderWidth: 0.29,
            borderColor: "gray",
            marginVertical: "4%",
          }}
        ></View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView horizontal={false}>

      <View style={styles.container}>
        <View >
        <Image
          source={require("../assets/Logo.png")}
          style={styles.backgroundImage}
        
          resizeMode="contain"
        >
        </Image>
        <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => navigation.navigate("Profile")}
          >
            <Avatar  size={styles.profileAvatar.height}  name={
             "Karl Meier"
          } />
          </TouchableOpacity>
 
        </View>
 
       <View style={{ backgroundColor: "#495e57" }}>
          <Text
            style={{
              color: "#F9D949",
              margin: "4%",
              fontSize: 44,
              marginBottom: 0,
            }}
          >
            Little Lemon
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", fontSize: 28, marginLeft: "4%" }}>
              Chicago
            </Text>
            <Image
              source={require("../assets/Bruschetta.png")}
              style={{
                width: 140,
                height: 170,
                marginLeft: "32%",
                borderRadius: 10,
                top: "3%",
              }}
            />
          </View>
          <Text
            style={{
              color: "white",
              marginLeft: "4%",
              fontSize: 18,
              bottom: "27%",
            }}
          >
            We are a family ownwed{`\n`} Mediterranean restaurent,{`\n`} focused
            on traditional{`\n`} recipes served with a{`\n`} modern twist.
          </Text>
          <View
            style={{
              bottom: "9%",
              //marginLeft: "13%",
              backgroundColor: "#edefee",
              width: "92%",
              height: 60,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <TextInput placeholder="Search Dishes" onChangeText={handleSearchTextChange} value={searchText}
              style={{
                width: "100%",
                flex: 1,
                paddingLeft: "10%",
                fontSize: 18,
                color: "black",
                marginLeft:'2%'
              }}
            />
            <View style={{ position: "absolute", left: "4%", }}>
              <FontAwesome name="search" size={24} color="black"/>
            </View>
          </View>
        </View>
        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: "5%",
            marginTop: "10%",
          }}
        >
          ORDER FOR DELIVERY!
        </Text>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            marginRight: 10,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setStarterActive(!starterActive);
              handleCategoryPress("starters")
            }}
            style={{
              backgroundColor: starterActive ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: starterActive ? "white" : "black",
              }}
            >
              Starters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMainsActive(!mainsActive);
              handleCategoryPress("mains")
            }}
            style={{
              backgroundColor: mainsActive ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: mainsActive ? "white" : "black",
              }}
            >
              Mains
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDesertsActive(!desertsAcitve);
              handleCategoryPress("desserts")
            }}
            style={{
              backgroundColor: desertsAcitve ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: desertsAcitve ? "white" : "black",
              }}
            >
              Desserts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDrinks(!drinks);
            }}
            style={{
              backgroundColor: drinks ? "black" : "#E1DFDF",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              width: 100,
              height: 50,
            }}
          >
            <Text
              style={{ fontWeight: "bold", color: drinks ? "white" : "black" }}
            >
              Drinks
            </Text>
          </TouchableOpacity>
        </ScrollView>


       <View>
          <FlatList data={data} renderItem={RenderMenuItem} style={{ flex: 1 }} />
          </View>
          </View>
</ScrollView>
        

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container0: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    width: "100%",
  },
  container2: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",

  },

  profileContainer: {
    left: "44%",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 63,
    height: 63,
    borderRadius: 30,
  },
  backgroundImage: {
    width: "30%",
    height: 100,

  },
});

export default Home;