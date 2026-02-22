import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity,Linking, Image, View } from 'react-native';
import { theme } from '../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Carousel from 'react-native-snap-carousel';

async function consultarIduser() {
  try {
    const value = await AsyncStorage.getItem('iduser');
    return value;
  } catch (error) {
    console.log('ERROR EN GETITEM INICIO', error);
    return null;
  }
}



async function consultarName() {
  try {
    const value = await AsyncStorage.getItem('name_short');
    console.log('name', value)
    return value;
  } catch (error) {
    console.log('ERROR EN getNOmbre INICIO', error);
    return null;
  }
}

async function consultarGender() {
  try {
    const value = await AsyncStorage.getItem('gender');

    return value;
  } catch (error) {
    console.log('ERROR EN getNOmbre INICIO', error);
    return null;
  }
}
function InicioScreen({ navigation, route }) {


  const [data, setData] = useState({});
  const [idUser, setIdUser] = useState(null);
  const [datas, setDatas] = useState([]);
  const [userName, setUserName] = useState([]);
  const [gender, setUserGender] = useState([]);

  const fetchDataInfo = async (idUserr) => {

    console.log('DENTRO');

    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer hoop2023!');

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      if (idUserr) {
        console.log('idUser', idUser)
        const response = await fetch('https://hoopcr.com/api/home/' + idUserr, requestOptions);
        const res = await response.json();
        console.log('res', res);

        return res.message;
      }
    } catch (error) {
      console.error(error);
    }
  };



   useEffect(async () => {
 
     // Función para obtener los datos de las clases y actualizar el estado
     const fetchData = async () => {
       const userIDFromStorage = await consultarIduser();
       console.log('userIDFromStorage', userIDFromStorage)
       setIdUser(userIDFromStorage);
       console.log('userIDFromStorage', userIDFromStorage)
 
 
       const userName = await consultarName();
       setUserName(userName);
 
       const gender = await consultarGender();
       setUserGender(gender);
       const classes = await fetchDataInfo(userIDFromStorage);
       console.log('classes', classes)
       setDatas(classes);
     };
 
 
     if (route.params?.fetchDataOnMount) {
       await fetchData();
     }
 
     // Llamar a fetchData cuando la pantalla obtenga el enfoque
     const unsubscribe = navigation.addListener('focus', fetchData);
 
     // Limpiar el evento cuando la pantalla se desmonte
     return unsubscribe;
   }, [navigation]);
 

  const completedClasses = datas?.classes?.completed_classes ?? 0;
  const availableClasses = datas?.classes?.available_classes ?? 0;


  const imageUrl = datas?.images?.[0]?.url;

  console.log('imageUrl', imageUrl);
  const imagenes = datas.images ?? [];



  const renderImage = ({ img }) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} resizeMode="contain" source={{ uri: img }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>¡Bienvenid{gender == 1 ? "o" : "a"} {userName}!
        </Text>
        <Text style={styles.headerText}>
          ¿List{gender == 1 ? "o" : "a"} para rodar?
        </Text>
      </View>

      <View style={styles.classesContainer}>
        <View style={styles.classBox}>
          <Text style={styles.classCount}>{completedClasses}</Text>
          <Text style={styles.classLabel}>Clases completadas</Text>
        </View>
        <View style={styles.classBox}>
          <Text style={styles.classCount}>{availableClasses}</Text>
          <Text style={styles.classLabel}>Clases disponibles</Text>
        </View>
      </View>

      <View style={styles.reservarContainer}>
        {/** <MaterialCommunityIcons name="calendar" size={34} color={theme.colors.cuarto} />*/}
        <Text style={styles.reservarText}>¿Ya reservaste tu clase?</Text>
        <Button onPress={() => navigation.navigate('Calendario')} mode="contained" style={styles.reservarButton}>
          Reservar
        </Button>
      </View>
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="stretch" source={{ uri: imageUrl }} />
        </View>
      )}

      <View style={styles.socialMedia}>
        <TouchableOpacity onPress={() => { 
          Linking.openURL('https://wa.me/+50663324915?text=');
        }} >
          <MaterialCommunityIcons name="whatsapp" size={34} color={theme.colors.cuarto} />
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => { 
          Linking.openURL('https://m.me/hoopstudioscr');
        }} >
          <MaterialCommunityIcons name="facebook" size={34} color={theme.colors.cuarto} />
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => { 
          Linking.openURL('https://www.instagram.com/hoopstudioscr');
        }} >
          <MaterialCommunityIcons name="instagram" size={34} color={theme.colors.cuarto} />
        </TouchableOpacity>
       
        <TouchableOpacity  onPress={() => { 
          Linking.openURL('mailto:info@hoopcr.crom');
        }} >
          <MaterialCommunityIcons name="email" size={34} color={theme.colors.cuarto} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontWeight: 'bold',
    paddingTop: 20,
    height: '18%',
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    paddingLeft: 20
  },
  headerText: {
    fontFamily: 'OpenSans-Bold',
    color: theme.colors.white,
    fontSize: 25,
  },
  socialMedia: {
    textAlign: 'center',
    height: '10%',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  classesContainer: {
    height: '20%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  classBox: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: theme.colors.ter,
  },
  classCount: {
    fontFamily: 'open-sans-light',
    color: theme.colors.white,
    fontSize: 25,
  },
  classLabel: {
    fontFamily: 'open-sans-light',
    color: theme.colors.white,
  },
  reservarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    height: '20%',
  },
  reservarText: {
    fontFamily: 'open-sans-light',
    fontSize: 15,
  },
  reservarButton: {
    width: '50%',
  },
  imageContainer: {
    margin: 10,
    backgroundColor: theme.colors.white,
    height: '25%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default InicioScreen;
