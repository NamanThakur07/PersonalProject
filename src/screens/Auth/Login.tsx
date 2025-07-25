import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../store/actions/authAction';
import { RootState } from '../../store/reducers/rootReducer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CustomTextInput from '../../components/UI/CustomTextInput';
import BannerViewComponent from '../../components/UI/BannerViewComponent';
import CustomeButton from '../../components/UI/CustomButton';
import colors from '../../constants/colors';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

interface FormField {
  id: string;
  type: 'email' | 'password';
  label: string;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const Login: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const formFields: FormField[] = [
    {
      id: 'email',
      type: 'email',
      label: 'Email*',
      placeholder: 'Email',
      required: true,
      keyboardType: 'email-address',
      autoCapitalize: 'none'
    },
    {
      id: 'password',
      type: 'password',
      label: 'Password*',
      placeholder: 'Password',
      required: true,
      secureTextEntry: true
    }
  ];

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[id]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    formFields.forEach(field => {
      if (field.required && !formData[field.id as keyof typeof formData]) {
        errors[field.id] = `${field.label.replace('*', '')} is required`;
      } else if (field.id === 'email' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(loginRequest(formData));
    }
  };

  const renderFormField = (field: FormField) => {
    return (
      <View key={field.id}>
        <CustomTextInput
          label={field.label}
          placeholder={field.placeholder}
          value={formData[field.id as keyof typeof formData]}
          onChangeText={(text: string) => handleChange(field.id, text)}
          secureTextEntry={field.secureTextEntry}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          error={validationErrors[field.id]}
        />
      </View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <BannerViewComponent title={'Welcome Back'} subTitle={'Lorem ipsum dolor sit amet consectetur. In pharetra placerat lorem enim felis enim id tortor morbi.'} />
    
    <View style={{top:40,flex:0.2,backgroundColor:'transparent'}}>
      <View style={styles.formContainer}>
        {formFields.map(renderFormField)}
      </View>
      
      {/* {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )} */}
      <CustomeButton
        title={'login'}
        onPress={loginRequest}
        style={{
          backgroundColor: colors.buttonbgColor,
          paddingHorizontal: 30,
          marginVertical: 20,
          width:'60%',
          alignSelf:'center'
        }}
        textStyle={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.buttonColor,
        }}
      />
    </View>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
    subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  error: {
    color: 'transparent',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor:'transparent',
    top:40,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: 24,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'flex-end',
    flex:0.1,
    backgroundColor:'transparent',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default Login;