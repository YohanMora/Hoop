import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { format, parseISO } from 'date-fns'; // Importar funciones de formateo de fechas
import { es } from 'date-fns/locale'; // Importar el idioma español
import logica from '../../logica'


// Función para obtener el idUser de AsyncStorage
const getUserIDFromStorage = async () => {
  try {
    const idUser = await AsyncStorage.getItem('iduser');
    return idUser;
  } catch (error) {
    console.log('Error al obtener el idUser de AsyncStorage:', error);
    return null;
  }
};

const deleteClass = async (idClass) => {

  const userIDFromStorage = await getUserIDFromStorage();
  const result = await logica.deleteClass(idClass);
  console.log('result', result);
  if (result) {
    if (result.data.error) {
      Alert.alert('', result.data.message)
    } else {
      Alert.alert('', result.data.message)
      const classes = await fetchClasses(userIDFromStorage);
      setDatas(classes);
    }

  }
}
const fetchClasses = async (idUser) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer hoop2023!');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch(`https://hoopcr.com/api/classes_user/${idUser}`, requestOptions);
    const res = await response.json();

    if (res.error) {
      Alert.alert('', res.message);
      return []; // Devuelve un array vacío para indicar que no hay datos válidos
    }

    // Verifica si la propiedad 'message' y 'classes' están presentes en la respuesta
    const classes = res.message?.classes || [];
    return classes;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return []; // Devuelve un array vacío para indicar que no hay datos válidos
  }
};

const MisClasesScreen = ({ navigation }) => {
  const [datas, setDatas] = useState([]);
  const [idUser, setUserID] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de las clases y actualizar el estado
    const fetchData = async () => {
      const userIDFromStorage = await getUserIDFromStorage();
      setUserID(userIDFromStorage);
      const classes = await fetchClasses(userIDFromStorage);
      setDatas(classes);
    };

    // Llamar a fetchData cuando la pantalla obtenga el enfoque
    const unsubscribe = navigation.addListener('focus', fetchData);

    // Limpiar el evento cuando la pantalla se desmonte
    return unsubscribe;
  }, [navigation]);

  // Paso 1: Función para agrupar las clases por fecha
  const groupClassesByDate = (classes) => {
    return classes.reduce((acc, currentClass) => {
      const classDate = currentClass.class_date;
      if (!acc[classDate]) {
        acc[classDate] = [];
      }
      acc[classDate].push(currentClass);
      return acc;
    }, {});
  };

  // Paso 2: Obtener las fechas de las clases agrupadas
  const groupedClasses = groupClassesByDate(datas);
  const sortedDates = Object.keys(groupedClasses).sort();

  // Función para formatear la fecha en el formato "23 agosto 2023"
  const formatDate = (date) => {
    return format(parseISO(date), "dd MMMM yyyy", { locale: es }); // Ajusta el idioma a tu necesidad
  };

  const convertirHora = (hora) => {
    const [hours, minutes, seconds] = hora.split(':');
    const validISOString = `1970-01-01T${hours}:${minutes}:${seconds}`;


    return format(parseISO(validISOString), 'hh:mm a')
  }

  // Paso 3: Mostrar las clases agrupadas por fecha
  const renderClassesByDate = (date) => {
    return (
      <View>
        <Text style={styles.dateHeader}>{formatDate(date)}</Text>
        {groupedClasses[date].map((item, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Card.Cover style={styles.teacherImage} source={{ uri: item.teacher_img }} />
              </View>
              <View style={styles.cardRight}>
                <Card.Content style={styles.row}>
                  <View style={styles.detalles} >
                    <Title style={styles.txt}>{item.name}</Title>
                    <Paragraph style={styles.txt}>{convertirHora(item.s_start)}  </Paragraph>
                  </View>
                  <View style={styles.deleteButton} >
                    <TouchableOpacity onPress={() => deleteClass(item.class_id)}>
                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        style={{ marginLeft: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </View>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis clases</Text>
      </View>
      <FlatList
        data={sortedDates}
        renderItem={({ item }) => renderClassesByDate(item)}
        keyExtractor={(item) => item} // Utiliza la fecha como key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 20,
    height: '15%',
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    paddingLeft: 20
  },
  headerText: {
    fontFamily: 'OpenSans-Bold',
    color: theme.colors.white,
    fontSize: 30,
    fontWeight: 'bold'
  },
  card: {
    margin: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
  },
  cardLeft: {

    flex: 0.4,
    width: '50%',
    margin: 10,
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
  },
  cardRight: {

    flex: 1,
    margin: 10,
    justifyContent: 'center',
  },
  rating: {
    width: 20,
  },
  cardAction: {
    flex: 0.5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'open-sans-light',
  },
  dateHeader: {
    fontFamily: 'open-sans-light',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 15,
  },
  deleteButton: {
    flex: 0.2,
    justifyContent: 'center',
  },
  detalles: {
    flex: 0.9,
  }
});

export default MisClasesScreen;