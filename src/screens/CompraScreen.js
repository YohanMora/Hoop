import React, { useEffect, useState } from 'react';
import { StyleSheet,Linking, Alert, Text, View, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { theme } from '../core/theme';
import { Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';


const fetchMemberships = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer hoop2023!");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://hoopcr.com/api/memberships", requestOptions);
    const res = await response.json();

    if (res.error) {
      console.error("Error en la respuesta del servidor:", res.message);
      return [];
    }

    const memberships = res.message?.memberships || [];
    return memberships;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
};

const CompraScreen = ({ navigation }) => {
  const [initialModal, setInicialModal] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMembershipsData = async () => {
      const membershipsData = await fetchMemberships();
      setMemberships(membershipsData);
    };

    fetchMembershipsData();
  }, []);

  const handleBuyMembership = async () => {
    setIsModalVisible(true);

    const idUser = await AsyncStorage.getItem('iduser');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer hoop2023!');
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        id_membership: selectedMembershipId,
        coupon_code: discountCode,
        id_user: idUser,
      }),
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://hoopcr.com/api/payment', requestOptions);
      const res = await response.json();

      if (res.error) {
        Alert.alert('', 'Error en la respuesta del servidor')
        console.error('Error en la respuesta del servidor:', res.message);
        // Aquí puedes manejar el caso de error en la compra si es necesario
      } else {
        Alert.alert('', 'Compra exitosa')
        // La compra fue exitosa, puedes realizar las acciones necesarias
        console.log('Compra exitosa:', res);
        // Por ejemplo, puedes mostrar una notificación de compra exitosa
      }
    } catch (error) {
      Alert.alert('', 'Error en la solicitud')
      console.error('Error en la solicitud:', error);
      // Aquí puedes manejar el caso de error en la solicitud si es necesario
    } finally {
      setIsModalVisible(false);
      setIsLoading(false);
    }
  };

  const renderMembership = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.checkboxContainer}>
          <View style={styles.cardLeft}>
            <Title style={styles.txtName}>{item.name}</Title>
            <Paragraph style={styles.txt}>  {item.description}</Paragraph>
            <Paragraph style={styles.txt}> Vigencia {item.days_membership} días</Paragraph>
          </View>
          <View style={styles.cardRigth}>
          <Title style={styles.txtPriceCol}>₡{item.regular_price_col}</Title>
            <Title style={styles.txtPrice}>${item.regular_price}</Title>
          </View>
        </View>

      </Card.Content>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => {
          //setSelectedMembershipId(item.id_membership);
          //setIsModalVisible(true);
          Linking.openURL('https://wa.me/+50663324915?&text='+item.wa_message);
        }}
      >
        <Text style={styles.buyButtonText}>Elegir paquete</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Membresias</Text>
      </View>

      <Modal visible={initialModal}   >
        <View style={styles.modalContainerInitial}>

          <View style={styles.modalContent}>

            <Text style={styles.modalText}>
              Las membresías son personales e intransferibles entre usuarios.
              Una vez realizada la compra no hay cambios ni devoluciones sobre el paquete de clases comprado.
            </Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setInicialModal(false)}
              >
                {<MaterialIcons name="check-box-outline-blank" size={24} color="black" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Confirmó la información proporcionada por Hoop.</Text>
            </View>
          </View>

        </View>
      </Modal>

      <FlatList
        data={memberships}
        renderItem={renderMembership}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
      />

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View>
              <Text style={styles.modalText}>Procesando la compra...</Text>
              <TextInput
                style={styles.discountInput}
                placeholder="Código de descuento"
                value={discountCode}
                onChangeText={setDiscountCode}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setIsLoading(true);
                  handleBuyMembership();
                }}
              >
                <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: theme.colors.background,
  },
  checkboxContainer: {
    flexDirection: 'row',
  },
  checkboxLabel: {
    fontFamily: 'open-sans-light',
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
  buyButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    fontFamily: 'OpenSans-Bold',
    color: theme.colors.white,
    fontSize: 16,
  },
  modalContainerInitial: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalText: {
    margin: 10,
    fontFamily: 'open-sans-light',
    fontSize: 18,
    marginBottom: 20,
    color: theme.colors.primary,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '80%',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  confirmButtonText: {
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
    color: theme.colors.white,
    fontSize: 16,
  },
  txt: {
    fontFamily: 'open-sans-light',
  },
  cardLeft: {

    flex: 0.7,
    width: '50%',
    margin: 10,
  },
  cardRigth: {
    textAlign:'center',
    flex: 0.3,
    alignItems: 'center',
    margin: 10,
  },
  txtPriceCol:{
    fontFamily: 'OpenSans-Bold',
  },
  txtName:{
    fontFamily: 'OpenSans-Bold',
  },
});

export default CompraScreen;