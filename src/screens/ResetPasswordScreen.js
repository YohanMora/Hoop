import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { Alert } from 'react-native';
import logica from '../../logica'

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = async () => {
    console.log('si estoy aqui');
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })

    }
    try {
      var body = JSON.stringify({
        email: email.value
      });
      console.log(body);
      const result = await  logica.lostPass(body);
      console.log('result', result);

      if (result) {
        if (result.data.error) {
          Alert.alert('Error', result.data.message.data);
        } else {
          Alert.alert('', result.data.message.data);
          setEmail({ value: '', error: '' })
        }
      }

    } catch (error) {
      // Handle any network or server errors
      Alert.alert('Error', '');
    }
    //navigation.navigate('LoginScreen')
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Recuperar contraseña</Header>
      <TextInput
        label="Correo electronico"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      //description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Enviar
      </Button>
    </Background>
  )
}
