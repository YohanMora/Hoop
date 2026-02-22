import React, { useState } from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Dropdown from '../components/dropdown';
export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [cedula, setCedula] = useState({ value: '', error: '' });
  const [birthdate, setBirthdate] = useState(new Date());
  const [shoe_size, setshoe_size] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const [terminosycondiciones, setTyC] = useState(false);
  const generos =  [{ label: "Género", value:0},{label: "Masculino", value:1},{ label: "Femenino", value:2}];

  const openLink = () => {
    const url = 'https://hoopcr.com/terminos-condiciones/';
    Linking.openURL(url);
  };

  const onSignUpPressed = async () => {

    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);


    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setDisabledButton(true)
    // Create a new user object with the gathered data
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      cedula: cedula.value,
      birthdate,
      shoe_size,
      address,
      gender,
    };


    console.log(birthdate)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer hoop2023!");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(newUser),
    };



    // Make a POST request to the API
    try {
      const response = await fetch("https://hoopcr.com/api/user", requestOptions);
      const data = await response.json();


      if (data.error) {
        Alert.alert('Error', data.message);
      } else {
       
        setName('');
        setEmail('');
        setPassword('');
        setCedula('');
        setPhone('');
       
        setshoe_size('');
        setAddress('');
        setGender(0);
        setTyC(false);

        setBirthdate(new Date());
        setDisabledButton(false);
        Alert.alert('', data.message);


        // navigation.navigate('Dashboard');
        // Alert.alert('Error', 'Failed to register user. Please try again.');
      }

    } catch (error) {
      setDisabledButton(false);
      Alert.alert('Error', data.message);
      // Handle any network or server errors
     // Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.btn}>
          <Button style={styles.btnSalir} onPress={() => navigation.navigate('LoginScreen')} >Salir</Button>
        </View>
        <Header>Crear cuenta</Header>

        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
          <TextInput
            label="Nombre"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: '' })}
            error={!!name.error}
            errorText={name.error}
          />
          <TextInput
            label="Cédula"
            returnKeyType="next"
            value={cedula.value}
            onChangeText={(text) => setCedula({ value: text, error: '' })}
            error={!!cedula.error}
            errorText={cedula.error}
          />
          <TextInput
            label="Correo"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Contraseña"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <TextInput
            label="Teléfono"
            returnKeyType="next"
            value={phone.value}
            onChangeText={(text) => setPhone({ value: text, error: '' })}
            error={!!phone.error}
            errorText={phone.error}
            keyboardType="phone-pad"
          />


          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Fecha de nacimiento</Text>

            <DateTimePicker
              value={new Date(birthdate)} // Asegúrate de convertir la fecha a un objeto Date si `birthdate` es una cadena
              mode="date"
              display="compact" // Puedes ajustar el modo de visualización según tus preferencias
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || new Date(birthdate); // Usa `birthdate` si no se selecciona una nueva fecha
                setBirthdate(currentDate);
              }}
            />

          </View>

          <View style={styles.pickerContainer}>
            <Dropdown  label="Género" data={generos} onSelect={(text)=>setGender(text.value)} />
          </View>

          <TextInput
            label="Talla de zapato"
            returnKeyType="next"
            value={shoe_size}
            onChangeText={(text) => setshoe_size(text)}
            keyboardType="numeric"
          />
          <TextInput
            label="Dirección"
            returnKeyType="next"
            value={address}
            onChangeText={(text) => setAddress(text)}
            multiline
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTyC(!terminosycondiciones)} // Cambia el estado al hacer clic
            >
              {terminosycondiciones ? ( // Usa un operador ternario para determinar el icono
                <MaterialIcons name="check-box" size={24} color="black" /> // Icono de "check"
              ) : (
                <MaterialIcons name="check-box-outline-blank" size={24} color="black" /> // Icono sin marcar
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={openLink}>
              <Text style={styles.checkboxLabel}>Acepto términos y condiciones.</Text>
            </TouchableOpacity>
          </View>
          <Button disabled={disabledButton} mode="contained" onPress={onSignUpPressed} style={styles.button}>
            Registrarse
          </Button>
        </ScrollView>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  btn: {

    backgroundColor: theme.colors.secondary,
    width: '100%' // add width 
  },
  container: {
    width: '100%',
    marginTop: 150,
    marginBottom: 100
  },
  scrollView: {
    width: '100%',
  },
  pickerContainer: {
    borderRadius:3,
    paddingLeft:10,
    color: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor:'#737373',
    fontFamily: 'open-sans-light',
    width: '100%',
    marginVertical: 12,
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 4,
  },
  pickerLabel: {
    fontSize: 16,
    color: theme.colors.primary,
    flex: 1,
  },
  pickerInput: {
    flex: 2,
    fontSize: 16,
    color: theme.colors.primary,
  },
  button: {
    marginTop: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnSalir: {
    fontWeight: 'bold',
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.primary,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    color: theme.colors.primary,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});