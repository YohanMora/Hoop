import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
import { Avatar, Button, Title, Paragraph, Card, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
import Dropdown from '../components/dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import logica from '../../logica';
import { subDays, parseISO, format, isSameDay } from 'date-fns'; // Importa subDays, format e isSameDay desde la librería date-fns
import { es } from 'date-fns/locale'; // Importar el idioma español

export default function PerfilScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [tabActual, setTabActual] = useState(1);
    const [membresiasData, setMembresias] = useState([]);
    const generos = [{ label: "Género", value: 0 }, { label: "Masculino", value: 1 }, { label: "Femenino", value: 2 }];

    useEffect(() => {
        // Retrieve the user data from AsyncStorage when the component mounts
        const fetchUserData = async () => {
            try {
                const keys = ['iduser', 'name', 'email', 'phone', 'birthdate', 'shoesize', 'address', 'gender'];
                const result = await AsyncStorage.multiGet(keys);

                // Convert the result array to an object
                const userDataObject = result.reduce((acc, [key, value]) => {
                    console.log(value);
                    acc[key] = value;
                    return acc;
                }, {});
                //console.log('userDataObject',userDataObject.iduser)
                setUserData(userDataObject);
                membresias(userDataObject.iduser);


            } catch (error) {
                console.log('Error retrieving user data from AsyncStorage:', error);
            }
        };

        fetchUserData();

    }, []);

    const eliminar = async () => {
        const result = await logica.deleteUser(userData.iduser);
        console.log('result', result);

        if (result) {
            if (result.data.error) {
                Alert.alert('', result.data.message);
            } else {
                Alert.alert('', result.data.message);
                navigation.navigate('LoginScreen');
                AsyncStorage.clear();
            }
        }
    }
    const eliminarCuenta = async () => {
        Alert.alert('', '¿Estas seguro de que quieres eliminar tu cuenta?', [

            {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Eliminar', onPress: () => eliminar() },
        ]);
    }

    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear - 100, 0, 1);

    console.log('minDate', minDate)

    const formatDate = (date) => {
        return format(parseISO(date), "dd MMMM yyyy", { locale: es }); // Ajusta el idioma a tu necesidad
    };


    const membresias = async (iduser) => {
        console.log('userData.iduser', iduser);
        const result = await logica.datosMembresias(iduser);
        console.log('result', result);
        if (result.data.error) {
            Alert.alert('', 'No hay datos disponibles.');
        } else {
            console.log()
            setMembresias(result.data.message.membership)
        }
    }



    const onSaveChangesPressed = async () => {
        // Save the updated data to AsyncStorage
        try {
            /*const items = [
              ['iduser', userData.iduser],
              ['name', userData.name],
              ['email', userData.email],
              ['phone', userData.phone],
              ['birthdate', userData.birthdate],
              ['shoesize', userData.shoesize],
              ['address', userData.address],
            ];
            await AsyncStorage.multiSet(items);*/
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer hoop2023!");


            // Send PUT request to update user data on the server
            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                redirect: 'follow',
                body: JSON.stringify({
                    id_user: userData.iduser,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    gender: userData.gender,
                    birthdate: userData.birthdate, // Utilizar el formato "DD-MM-YYYY"
                    shoe_size: userData.shoesize,
                    address: userData.address,

                }),
            };
            console.log('data evio', userData)

            const response = await fetch('https://hoopcr.com/api/user', requestOptions);
            const jsonData = await response.json(); // Obtener la respuesta como JSON

            console.log('Respuesta del servidor:', jsonData);

            //const data = await response.json();

            if (!jsonData.error) {
                Alert.alert(jsonData.message);
            } else {
                Alert.alert(jsonData.message);
            }
        } catch (error) {
            console.log('Error saving user data to AsyncStorage or sending PUT request:', error);
            Alert.alert('Error al guardar los cambios. Por favor, intenta de nuevo.');
        }
    };
    return (
        <View style={styles.principal}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Perfil</Text>
            </View>
            <View style={styles.tabs}>
                <TouchableOpacity style={styles.tab1} onPress={() => setTabActual(1)}>
                    <View  >
                        <Text style={styles.txtTab}>Perfil</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab2} onPress={() => setTabActual(2)}>
                    <View >
                        <Text style={styles.txtTab}>Membresias</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {tabActual == 1 &&
                <ScrollView  style={styles.ScrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <TextInput
                            label="Nombre"
                            value={userData?.name}
                            onChangeText={text => setUserData({ ...userData, name: text })}
                            mode={'outlined'}
                            style={styles.textInput}
                        />
                        <TextInput
                            label="Correo"
                            value={userData?.email}
                            onChangeText={text => setUserData({ ...userData, email: text })}
                            mode={'outlined'}
                            style={styles.textInput}
                        />
                        <TextInput
                            label="Teléfono"
                            value={userData?.phone}
                            onChangeText={text => setUserData({ ...userData, phone: text })}
                            mode={'outlined'}
                            style={styles.textInput}
                        />

                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Fecha de nacimiento</Text>

                            <DateTimePicker
                                value={userData?.birthdate ? new Date(userData?.birthdate) : new Date()} // Asegúrate de convertir la fecha a un objeto Date si `birthdate` es una cadena
                                mode="date"
                                display="compact" // Puedes ajustar el modo de visualización según tus preferencias
                                onSelect={text => setUserData({ ...userData, birthdate: text })}
                            />
                        </View>

                        <TextInput
                            label="Número de calzado"
                            value={userData?.shoesize}
                            onChangeText={text => setUserData({ ...userData, shoesize: text })}
                            mode={'outlined'}
                            style={styles.textInput}
                        />


                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Género</Text>

                            <Dropdown
                                valorPreseleccionado={generos.filter((item) => {
                                    return userData?.gender ? item.value == userData?.gender : 0
                                })[0]}
                                label="Género"
                                data={generos}
                                onSelect={(text) => setUserData({ ...userData, gender: text })} />
                        </View>


                        <TextInput
                            label="Dirección"
                            value={userData?.address}
                            onChangeText={text => setUserData({ ...userData, address: text })}
                            mode={'outlined'}
                            style={styles.textInput}
                        />
                        <Button mode="contained" onPress={onSaveChangesPressed}>
                            Guardar Cambios
                        </Button>

                        <Button mode="" onPress={() => eliminarCuenta()}>
                            Eliminar cuenta
                        </Button>
                    </View>




                </ScrollView>
            }
            {tabActual == 2 &&
                <View style={styles.container}>
                    <FlatList
                        data={membresiasData}
                        renderItem={({ item }) => (
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Title style={styles.txt}>{item.membership_name}</Title>
                                    <Paragraph style={styles.txt}>{formatDate(item.payment_date)} </Paragraph>
                                    <Paragraph style={styles.txt}>{item.membership_description} </Paragraph>

                                </Card.Content>
                            </Card>
                        )}
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    ScrollView:{ 
        height: '75%',
    },
    container: {
        margin: 20,
        height: '75%',
    },
    principal: {

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
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme.colors.primary,
        marginBottom: 15,
        paddingVertical: 10,

    },
    datePickerLabel: {
        fontFamily: 'open-sans-light',
        fontSize: 16,
        color: theme.colors.primary,
        flex: 1,
    },
    datePicker: {
        flex: 2,
        fontFamily: 'open-sans-light',
        fontSize: 16,
        color: theme.colors.primary,
    },
    textInput: {
        fontFamily: 'open-sans-light',
        margin: 5, // Add padding of 10 to the TextInput components
    }, pickerContainer: {
        borderRadius: 3,
        backgroundColor: 'white',
        color: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#737373',
        fontFamily: 'open-sans-light',
        width: '98%',
        marginVertical: 12,
        fontSize: 18,
        paddingLeft: 10,
        margin: 5,
    },
    pickerLabel: {

        margin: 5,
        color: 'black',
        fontFamily: 'open-sans-light',
        fontSize: 12,

        flex: 1,
    },
    pickerInput: {
        fontFamily: 'open-sans-light',
        flex: 2,
        fontSize: 16,

        color: theme.colors.primary,
    },
    txt: {
        fontFamily: 'open-sans-light',
    },
    tabs: {
        flexDirection: 'row',

    },
    tab1: {
        alignItems: 'center',
        flex: 0.5,
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.secondary,
    },
    tab2: {
        alignItems: 'center',
        flex: 0.5,
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.secondary,
    },
    txtTab: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
    },
    card: {
        margin: 5,
        height: 100,
    },
    cardContent: {

        padding: 10,
    },
});
