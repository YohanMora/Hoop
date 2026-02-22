import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View, FlatList, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { theme } from '../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { subDays, parseISO, format, isSameDay } from 'date-fns'; // Importa subDays, format e isSameDay desde la librería date-fns
import { es } from 'date-fns/locale'; // Importar el idioma español
import { Dimensions } from 'react-native'; // Importar Dimensions desde 'react-native'
const { width } = Dimensions.get('window');





const fetchSeats = async (scheduleId) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer hoop2023!');

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(`https://hoopcr.com/api/seat/${scheduleId}`, requestOptions);
        const res = await response.json();
        const seats = res.message?.seat || [];
        return seats;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const fetchClasses = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer hoop2023!');

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch('https://hoopcr.com/api/classes', requestOptions);
        const res = await response.json();

        // setSelectedDate(new Date())
        return res.message.classes;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const HorariosScreen = ({ navigation }) => {

    const [datas, setDatas] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isSelectSeatModalVisible, setIsSelectSeatModalVisible] = useState(false);
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [isTeacherModalVisible, setIsTeacherModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState({});



    useEffect(() => {

        console.log('useEffect')
        const fetchData = async () => {
            const classes = await fetchClasses();
            setDatas(classes);
            setSelectedDate(new Date())

        };
        // fetchData();

        // Llamar a fetchData cuando la pantalla obtenga el enfoque
        const unsubscribe = navigation.addListener('focus', fetchData);
        //setSelectedDate(new Date())

        // Limpiar el evento cuando la pantalla se desmonte


        //setSelectedDate(new Date());
        //console.log('useEffect')
        const classesBySelectedDate = getClassesBySelectedDate(selectedDate);
        setFilteredClasses(classesBySelectedDate);

        return unsubscribe;
    }, [navigation, selectedDate]);

    const isToday = (date) => {

        const today = new Date();
        return isSameDay(date, today);
    };
    // Paso 1: Create a function to get the last 5 days
    const getLastFiveDays = () => {
        const today = new Date();
        const dates = Array.from({ length: 5 }, (_, index) => subDays(today, index));
        return dates;
    };

    const getLastSevenDays = () => {
        const today = new Date();
        const daysAfter = Array.from({ length: 8 }, (_, index) => subDays(today, -index - 1));
        return [today, ...daysAfter];
    };
    const [lastSevenDays, setLastSevenDays] = useState(getLastSevenDays());

    // Paso 2: Get the last 5 days and update the state
    const [lastFiveDays, setLastFiveDays] = useState(getLastFiveDays());


    const renderDateSelector = () => {

        return (
            <FlatList
                horizontal
                contentContainerStyle={styles.dateSelector}
                data={lastSevenDays}
                renderItem={({ item }) => (

                    <TouchableOpacity
                        style={[
                            styles.dateButton,
                            isSameDay(selectedDate, item) && styles.selectedDateButton,
                            isToday(item) && styles.todayDateButton,
                        ]}
                        onPress={() => setSelectedDate(item)}
                    >
                        <Text
                            style={[
                                styles.dateButtonText,
                                isSameDay(selectedDate, item) && styles.selectedDateText,
                                isToday(item) && styles.todayDateText,
                            ]}
                        >
                            {format(item, 'dd MMM', { locale: es })}
                        </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.getTime().toString()}
            />
        );
    };
    const getClassesBySelectedDate = (date) => {
        // Adjust the date for the Costa Rica timezone (GMT-6)
        const fecha = format(date, 'yyyy-M-dd', { locale: es });
        const costaRicaOffset = -6 * 60; // Offset in minutes
        const adjustedDate = new Date(fecha);
        const filteredClasses = datas.filter((item) => {
            const classDate = new Date(item.class_date); // Convert class_date to a Date object
            return isSameDay(classDate, adjustedDate);
        });

        // Ordena las clases por hora de inicio ascendente
        filteredClasses.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.s_start}`);
            const timeB = new Date(`1970-01-01T${b.s_start}`);
            return timeA - timeB;
        });

        return filteredClasses;
    };
    const convertirHora = (hora) => {
        const [hours, minutes, seconds] = hora.split(':');
        const validISOString = `1970-01-01T${hours}:${minutes}:${seconds}`;


        return format(parseISO(validISOString), 'hh:mm a')
    }

    const renderItem = ({ item }) => {

        const [hours, minutes, seconds] = item.s_start.split(':');
        const validISOString = `1970-01-01T${hours}:${minutes}:${seconds}`;

        return (
            <Card style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                        <Paragraph>{convertirHora(item.s_start)}</Paragraph>
                        <Card.Cover style={styles.teacherImage} source={{ uri: item.teacher_img }} />

                    </View>
                    <View style={styles.cardRight}>
                        <Card.Content>
                            <Title style={styles.title}>{item.name}</Title>
                            <TouchableOpacity  >
                                <Text style={styles.teacher_name}>Coach: {item.teacher_name}</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </View>
                    <View style={styles.cardAction}>
                        <Button textColor='white' style={styles.btn} onPress={() => handleReservarClase(item)}>Reservar</Button>
                    </View>

                </View>
                {item.xlabel && <Text style={styles.sintillo}>{item.label}</Text>}
                {renderSeatSelectionModal()}
            </Card>

        );
    };

    const handleReservarClase = async (clase) => {

        setSelectedClass(clase);

        try {
            // Obtener los asientos disponibles para la clase seleccionada
            const seats = await fetchSeats(clase.id_schedule);
            if (seats.length === 0) {
                Alert.alert(
                    'No hay espacios disponibles',
                    'Lo sentimos, no hay espacios disponibles para esta clase.'
                );
                return;
            }

            setSeats(seats);
            setData(clase);
            setIsSelectSeatModalVisible(true);
        } catch (error) {
            console.error(error);
            setSeats([]);
        }
    };

    const handleCancelReserva = () => {
        setIsSelectSeatModalVisible(false);
        setSelectedSeat(null);
    };

    const handleConfirmReserva = async (info) => {
        if (selectedSeat) {
            if (!selectedSeat) {
                Alert.alert('Error', 'Debes seleccionar un asiento antes de confirmar la reserva.');
                return;
            }
            const idUser = await AsyncStorage.getItem('iduser');
            // Realizar la reserva con el asiento seleccionado
            const reservaData = {
                id_user: idUser, // Aquí debes obtener el ID del usuario desde AsyncStorage o donde lo tengas almacenado
                id_schedule: selectedClass.id_schedule,
                id_seat: selectedSeat.id_seat,
            };
            console.log('reservaData',reservaData);
            try {
                const response = await fetch('https://hoopcr.com/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer hoop2023!',
                    },
                    body: JSON.stringify(reservaData),
                });

                const data = await response.json();
                if (!data.error) {
                    // Puedes hacer algo con la respuesta de la reserva si es necesario


                    setIsSelectSeatModalVisible(false);
                    setSelectedClass(null);
                    setSelectedSeat(null); 
                    const date = formatDate(info.class_date)
                    console.log('date', date);
                    const time = convertirHora(info.s_start)
                    console.log('time', time);


                    Alert.alert('¡Hiciste una reserva!\n',
                        'Fecha: ' + date + ' \n ' +
                        'Hora: ' + time + ' \n ' +
                        'Tu bici: ' + selectedSeat.name + ' \n ' +
                        'Coach: ' + info.teacher_name + '\n \n' +
                        'Recuerda llegar 15 minutos antes del inicio de tu clase. No olvides tu botella de agua y tu energía.\n \n' +
                        '¡Nos vemos en la bici!'
                    );
                } else {
                 console.log('RESPONSE',data)
                    Alert.alert('Error', 'Ocurrió un error al realizar la reserva.');
                }

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Ocurrió un error al realizar la reserva.');
            }
        }
    };

    /*useEffect(() => { 

        //setSelectedDate(new Date());
        //console.log('useEffect')
        const classesBySelectedDate = getClassesBySelectedDate(selectedDate);
        setFilteredClasses(classesBySelectedDate);

    }, [selectedDate]);*/


    const formatDate = (date) => {
        return format(parseISO(date), "dd MMMM yyyy", { locale: es }); // Ajusta el idioma a tu necesidad
    };

    const seatDisabled = () => {
        return (
            <View style={styles.seatDisabled}><Text></Text></View>
        )
    }
    const seat = (seat, number) => {

        if (seat) {
            return (

                <TouchableOpacity
                    style={[
                        styles.seat,
                        selectedSeat === seat && styles.selectedSeat,
                        seat.available === 'false' && styles.unavailableSeat,
                    ]}
                    key={seat.id_seat} disabled={seat.available === 'false' ? true : false} onPress={() => setSelectedSeat(seat)} >
                    <Text>{number}</Text>
                </TouchableOpacity>

            )
        }
    }
    const renderSeatSelectionModal = () => {
        if (data.class_date) {
            const fecha = formatDate(data.class_date);// data ? format(data.class_date, 'yyyy-M-dd', { locale: es }):'';

            return (
                <Modal visible={isSelectSeatModalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Ride con {data.teacher_name}</Text>

                            <Text style={styles.modalTextDetail}> {fecha} / {convertirHora(data.s_start)}</Text>

                            <ScrollView horizontal={true}  >
                                <View style={styles.seatContainer}>
                                    <View style={styles.seatContent}>
                                        {seatDisabled()}
                                        {seat(seats[0], 1)}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        <View style={styles.seatCoach}>
                                            <Text>
                                                Coach
                                            </Text>
                                        </View>
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seat(seats[1], 2)}
                                        {seatDisabled()}
                                    </View>

                                    <View style={styles.seatContent}>
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seatDisabled()}
                                        {seat(seats[2], 3)}
                                    </View>

                                    <View style={styles.seatContent}>
                                        {seat(seats[3], 4)}
                                        {seatDisabled()}
                                        {seat(seats[4], 5)}
                                        {seatDisabled()}
                                        {seat(seats[5], 6)}
                                        {seatDisabled()}
                                        {seat(seats[6], 7)}
                                        {seatDisabled()}
                                        {seat(seats[7], 8)}
                                        {seatDisabled()}
                                        {seat(seats[8], 9)}
                                        {seatDisabled()}
                                    </View>

                                    <View style={styles.seatContent}>
                                        {seatDisabled()}
                                        {seat(seats[9], 10)}
                                        {seatDisabled()}
                                        {seat(seats[10], 11)}
                                        {seatDisabled()}
                                        {seat(seats[11], 12)}
                                        {seatDisabled()}
                                        {seat(seats[12], 13)}
                                        {seatDisabled()}
                                        {seat(seats[13], 14)}
                                        {seatDisabled()}
                                        {seat(seats[14], 15)}
                                    </View>
                                    <View style={styles.seatContent}>
                                        {seat(seats[15], 16)}
                                        {seatDisabled()}
                                        {seat(seats[16], 17)}
                                        {seatDisabled()}
                                        {seat(seats[17], 18)}
                                        {seatDisabled()}
                                        {seat(seats[18], 19)}
                                        {seatDisabled()}
                                        {seat(seats[19], 20)}
                                        {seatDisabled()}
                                        {seat(seats[20], 21)}
                                        {seatDisabled()}
                                    </View>
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmReserva(data)}>
                                <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReserva}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Horarios</Text>
            </View>
            <View    >
                {renderDateSelector()}

                <FlatList
                    data={filteredClasses} // Usar filteredClasses en lugar de datas
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            <Modal visible={isTeacherModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedTeacher && (

                            <View style={styles.viewModal}>
                                <Text style={styles.modalText}>{selectedTeacher.name}</Text>
                                <View style={styles.cardContent}>
                                    <Card.Cover style={styles.teacherImage} source={{ uri: selectedTeacher.image }} />
                                    <Card.Title style={styles.biography} subtitle={selectedTeacher.biography} />
                                </View>
                                <View style={styles.viewStart}>
                                    <StarRating
                                        style={styles.rating}
                                        disabled={false}
                                        maxStars={5}
                                        rating={selectedTeacher.rating}
                                        fullStarColor={'gold'}
                                        emptyStarColor={'gray'}
                                        starSize={15}
                                    />
                                </View>
                            </View>
                        )}
                        <Card.Actions>
                            <Button onPress={() => setIsTeacherModalVisible(false)}>Cerrar</Button>
                        </Card.Actions>
                    </View>
                </View>
            </Modal>

            {/*<Modal visible={isSelectSeatModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Selecciona un asiento:</Text>
                        <FlatList
                            data={seats}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.seatButton, selectedSeat === item ? styles.selectedSeat : null]}
                                    onPress={() => setSelectedSeat(item)}
                                >
                                    <Text style={styles.seatButtonText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id_seat.toString()}
                        />
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReserva}>
                            <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReserva}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: 'open-sans-light',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 20,
        height: '15%',
        backgroundColor: theme.colors.secondary,
        justifyContent: 'center',
        paddingLeft: 20,
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
        margin: 10,
    },
    teacherImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginBottom: 10,
    },
    cardRight: {
        flex: 0.8,
        margin: 10,
        justifyContent: 'center',
    },
    cardAction: {
        flex: 0.5,
        justifyContent: 'center',
    },
    teacher_name: {
        fontSize: 10,
    },
    btn: {
        fontFamily: 'OpenSans-Bold',
        backgroundColor: theme.colors.primary,

    },
    viewModal: {
        width: width - 100,
    },
    modalContainer: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        padding: 20,
        height: '50%',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontFamily: 'open-sans-light',
        fontSize: 18,
        marginBottom: 20,
        color: theme.colors.primary,
    },
    seatButton: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        alignItems: 'center',
    },
    seatButtonText: {
        fontFamily: 'open-sans-light',
        fontSize: 16,
        color: theme.colors.primary,
    },
    selectedSeat: {
        backgroundColor: theme.colors.primary,
    },
    confirmButton: {
        fontFamily: 'open-sans-light',
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    confirmButtonText: {
        fontFamily: 'open-sans-light',
        color: theme.colors.white,
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: theme.colors.secondary,
        padding: 10,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        fontFamily: 'open-sans-light',
        color: theme.colors.white,
        fontSize: 16,
    },
    dateButton: {
        marginHorizontal: 5,
        backgroundColor: theme.colors.primary,
        borderRadius: 50,
        width: width / 4,
        padding: 11,
        margin: 8,
        height: 50

    },
    selectedDateButton: {

        backgroundColor: theme.colors.cuarto,
        color: 'red'
    },
    dateButtonText: {
        fontFamily: 'open-sans-light',
        color: theme.colors.white,
        fontSize: 18,
    },
    selectedDateText: {
        color: 'white'
    },
    dateSelector: {
        height: 60, // Ajusta la altura según tus preferencias
        marginTop: 10,
        marginBottom: 10,
    },
    title: {
        fontFamily: 'open-sans-light',
    },
    biography: {
        width: width,
    },
    viewStart: {
        alignContent: 'center',
        justifyContent: 'center',
        width: width / 3,
        alignItems: 'center',
    },
    sintillo: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        borderBottomEndRadius: 20,
        padding: 7
    },
    seatButton: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        alignItems: 'center',
    },
    seatButtonText: {
        fontFamily: 'open-sans-light',
        fontSize: 16,
        color: theme.colors.primary,
    },
    selectedSeat: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    unavailableSeat: {
        backgroundColor: 'gray',
        borderColor: 'gray',
        opacity: 0.5,
    },
    seatDisabled: {
        margin: 3,
        width: 23,
    },
    seat: {

        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',

        margin: 3,
        width: 23,
        borderRadius: 50,
        padding: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.primary,
    },
    seatContent: {
        flexDirection: 'row',
    },
    seatCoach: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        width: 88,
        borderRadius: 50,
        padding: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.primary,
    },
    seatContainer: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.primary,
        padding: 5,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTextDetail: {
        marginBottom: 15
    }
});

export default HorariosScreen;
