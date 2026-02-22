import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, ImageBackground, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import logica from '../../logica'


const getPass = async () => {
  try {
    const pass = await AsyncStorage.getItem('pass');
    return pass;
  } catch (error) {
    console.log('Error al obtener el pass de AsyncStorage:', error);
    return null;
  }
};
const getCorreo = async () => {
  try {
    const correo = await AsyncStorage.getItem('correo');
    return correo;
  } catch (error) {
    console.log('Error al obtener el correo de AsyncStorage:', error);
    return null;
  }
};
const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    var body = JSON.stringify({
      email: email.value,
      password: password.value
    });
    console.log(body);
    const result = await logica.login(body);
    console.log('result', result);
    if (result) {
      if (result.data.error) {
        console.log('HAY UN ERROR');
        Alert.alert('', result.data.message);
      } else {
        var info = result.data.message.user;


        const items = [
          ['iduser', info.id_user],
          ['name', info.name],
          ['name_short', info.name_short],
          ['email', info.email],
          ['phone', info.phone],
          ['birthdate', info.birthdate],
          ['shoesize', info.shoe_size],
          ['address', info.address],
          ['datetime', info.datetime],
          ['gender', info.gender],
          ['correo', email.value],
          ['pass', password.value],
        ]

        console.log(items);
        try {
          await AsyncStorage.multiSet(items);

        } catch (error) {
          console.log('MultiSET Error', error);
        }

        navigation.navigate('Dashboard')


      }
    }


  }

  useEffect(() => {
    const fetchCredentials = async () => {
      const storedCorreo = await getCorreo();
      const storedPass = await getPass();
      if (storedCorreo !== null) {
        setEmail({ value: storedCorreo, error: '' });
      }
      if (storedPass !== null) {
        setPassword({ value: storedPass, error: '' });
      }
    };

    fetchCredentials();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}

      style={styles.background}
    >
      <View style={styles.container} >
        <Image source={require('../assets/hoop.jpg')} style={styles.image} />

        <TextInput
          mode=""
          keyboardShouldPersistTaps="handled"
          style={styles.txt}
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
          mode=""
          style={styles.txt}
          label="Contraseña"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        <Button mode="contained" style={styles.texto} onPress={onLoginPressed}>
          <Text style={styles.texto}>Ingresar </Text>
        </Button>
        <View style={styles.row}>
          <Text style={styles.texto}>¿No tienes cuenta aún? </Text>
          <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
            <Text style={styles.link}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    fontWeight: 'bold',
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'normal',
    color: 'white',
  },
  link: {

    fontWeight: 'bold',
    fontSize: 17,
    fontStyle: 'normal',
    color: theme.colors.primary,
  },
  image: {
    width: '100%', height: 100, resizeMode: 'contain'
  },
  txt: {

    fontSize: 15,
    color: 'white',
  },
  texto: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LoginScreen;