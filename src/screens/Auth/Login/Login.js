import React, { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import API from '../../../services/API';
import { login } from '../../../store/ducks/authentication.duck';
import { colors } from '../../../utils/colors';
import MESSAGES from '../../../utils/formErrorMessages';
import { emailRegex, passwordRegex } from '../../../utils/formUtils';
import { getEncryptedData } from '../../../utils/storageManager';
import styles from './Login.style';

const theme = {
  roundness: 12,
  colors: {
    ...colors,
    background: 'white',
    placeholder: '#dedede',
    text: '#707070',
  },
};

function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const onLoginPress = async (data) => {
    setLoading(true);
    const dbConfig = await getEncryptedData(
      `dbCredentials_${data?.password}_${data?.email.replace('@', '')}`
    );
    if (dbConfig) {
      dispatch(login(dbConfig, { email: data?.email, password: data?.password }));
    } else {
      new API()
        .login({ email: data?.email, password: data?.password })
        .then((response) => {
          setLoading(false);
          if (response.error) {
            return;
          }
          dispatch(login(response, data));
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    }
  };

  const { control, handleSubmit, errors } = useForm({
    criteriaMode: 'all',
  });

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 30,
        paddingHorizontal: 30,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <KeyboardAvoidingView style={styles.containerView} behavior="position">
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* <MapBg */}
          {/*  width={220} */}
          {/*  height={190} */}
          {/*  style={{ */}
          {/*    marginTop: -50, */}
          {/*  }} */}
          {/* /> */}
        </View>

        <View style={{ marginBottom: 50, marginTop: 70, alignItems: 'center' }}>
          {/* <EADLLogo height={90} width={180} /> */}
          <Text
            style={{
              marginBottom: 15,
              fontFamily: 'Poppins_400Regular',
              fontSize: 19,
              fontWeight: 'bold',
              fontStyle: 'normal',
              lineHeight: 23,
              letterSpacing: 0,
              textAlign: 'center',
              color: '#707070',
            }}
          >
            {t('welcome_login')}
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
              <View style={styles.formContainer}>
                <View style={{ borderRadius: 10, marginBottom: 16 }}>
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInput
                        theme={theme}
                        autoCapitalize="none"
                        label={t('email')}
                        mode="outlined"
                        labelColor="#dedede"
                        style={styles.loginFormTextInput}
                        left={<TextInput.Icon name="account" color="#24c38b" />}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                      />
                    )}
                    name="email"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                      pattern: {
                        value: emailRegex,
                        message: 'Please enter a valid email address',
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInput
                        theme={theme}
                        mode="outlined"
                        placeholderColor="#dedede"
                        label={t('password')}
                        style={styles.loginFormTextInput}
                        left={
                          <TextInput.Icon
                            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                            name={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                            color="#24c38b"
                          />
                        }
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        secureTextEntry={isPasswordSecure}
                      />
                    )}
                    name="password"
                    rules={{
                      required: {
                        value: true,
                        message: MESSAGES.required,
                      },
                      minLength: {
                        value: 8,
                        message: MESSAGES.minLength,
                      },
                      pattern: {
                        value: passwordRegex,
                        message: MESSAGES.password,
                      },
                      maxLength: {
                        value: 40,
                        message: MESSAGES.maxLength,
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                  )}
                </View>

                {/* <TouchableOpacity style={styles.hintContainer}> */}
                {/*  <Text style={styles.textHint}>Forgo?</Text> */}
                {/* </TouchableOpacity> */}
              </View>
            </KeyboardAvoidingView>
            {loading ? (
              <ActivityIndicator size="large" color="#24c38b" />
            ) : (
              <Button
                // theme={theme}
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: errors ? '#24c38b' : '#dedede',
                  },
                ]}
                onPress={handleSubmit(onLoginPress)}
                color="white"
              >
                {t('login')}
              </Button>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default Login;
