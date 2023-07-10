import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Alert} from 'react-native'


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  useEffect(() => {
    const timer = setTimeout(logoutAfterInactivity, 2 * 60 * 1000); // Thời gian tính bằng mili giây (2 phút)
    return () => clearTimeout(timer);
  }, []);

  const logoutAfterInactivity = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'Hủy lưu trạng thái đăng nhập');
      // Thực hiện các thao tác khác khi người dùng thoát sau 2 phút không hoạt động
      Alert.alert('Phiên bản đăng nhập đã hết hạn !')
      
      navigation.navigate('LoginScreen');
      //Thoát thao tác và quay về trang đăng nhập
    
    } catch (error) {
      console.error('Lỗi khi tự động thoát sau 2 phút:', error);
    }
  }; 

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
  
    try {
      const response = await axios.post('http://10.30.3.27:3000/api/login', {
        email: email.value,
        password: password.value
      });
      
      // Xử lý logic phản hồi và điều hướng ở đây dựa trên thành công hay thất bại
      if (response.data === 'Đăng nhập thành công') {
        //Lưu trạng thái đăng nhập
        await AsyncStorage.setItem('isLoggedIn', 'Đã lưu trạng thái đăng nhập');
        // Đăng nhập thành công sẽ chuyển vào trang chủ
        navigation.navigate('Dashboard');
      
      } else {
        // Đăng nhập thất bại
        Alert.alert('Lỗi đăng nhập', 'Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (error) {
      //Xử lý bất kỳ lỗi nào xảy ra trong quá trình yêu cầu API
      console.error(error);
      Alert.alert('Lỗi đăng nhập', 'Đã xảy ra lỗi khi đăng nhập');
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Chào mừng đến React Mall</Header>
      <TextInput
        label="Email"
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
        label="Mật khẩu"
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
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Đăng nhập
      </Button>
      <View style={styles.row}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})