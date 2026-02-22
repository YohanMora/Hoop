import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { theme } from '../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { format, parseISO } from 'date-fns'; // Importar funciones de formateo de fechas
import { es } from 'date-fns/locale'; // Importar el idioma español


const fetchClasses = async (idUser) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer hoop2023!');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch('https://hoopcr.com/api/teachers', requestOptions);
    const res = await response.json();

    if (res.error) {
      Alert.alert('', res.message);
      return []; // Devuelve un array vacío para indicar que no hay datos válidos
    }

    // Verifica si la propiedad 'message' y 'classes' están presentes en la respuesta
    const classes = res.message?.teachers || [];
    return classes;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return []; // Devuelve un array vacío para indicar que no hay datos válidos
  }
};

const CoachesScreen = ({ navigation }) => {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (text) => {
    setSearchTerm(text);
  };
  const filteredCoaches = datas.filter((coach) =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Función para obtener los datos de las clases y actualizar el estado
    const fetchData = async () => {
      const classes = await fetchClasses();
      setDatas(classes);
    };

    // Llamar a fetchData cuando la pantalla obtenga el enfoque
    const unsubscribe = navigation.addListener('focus', fetchData);

    // Limpiar el evento cuando la pantalla se desmonte
    return unsubscribe;
  }, [navigation]);


  // Paso 3: Mostrar las clases agrupadas por fecha
  const renderClassesByDate = (item) => {
    return (
      <View>

        <Card key={item.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <Card.Cover style={styles.teacherImage} source={{ uri: item.image }} />
            </View>
            <View style={styles.cardRight}>
              <Card.Content>
                <Title style={styles.txt}>{item.name}</Title>
                <Paragraph style={styles.txt}>{item.biography}</Paragraph>
              </Card.Content>
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Coaches</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        value={searchTerm}
        onChangeText={handleSearchTermChange}
      />
      <FlatList
        data={filteredCoaches}
        renderItem={({ item, index }) => renderClassesByDate(item)}
        keyExtractor={(item) => item.id_schedule} // Asegúrate de usar una clave única
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
    width: '50%',
    margin: 10,
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  searchInput:{
    margin:5, 
  }
});

export default CoachesScreen;