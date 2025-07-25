import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequest } from '../../store/actions/authAction';
import { RootState } from '../../store/reducers/rootReducer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CustomCheckbox from '../../components/UI/CustomCheck';
import CustomTextInput from '../../components/UI/CustomTextInput';
import Toast from 'react-native-simple-toast';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  halfWidth?: boolean;
  linkType?: 'terms' | 'privacy';
}

const SignUp: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    tosAccept: false,
    privacyPolicyAccept: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const formFields: FormField[] = [
    {
      id: 'username',
      type: 'text',
      label: 'Username*',
      placeholder: 'Choose a username',
      required: true,
      autoCapitalize: 'none'
    },
    {
      id: 'firstName',
      type: 'text',
      label: 'First Name*',
      placeholder: 'Your first name',
      required: true,
      halfWidth: true
    },
    {
      id: 'lastName',
      type: 'text',
      label: 'Last Name*',
      placeholder: 'Your last name',
      required: true,
      halfWidth: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email*',
      placeholder: 'Your email address',
      required: true,
      keyboardType: 'email-address',
      autoCapitalize: 'none'
    },
    {
      id: 'password',
      type: 'password',
      label: 'Password*',
      placeholder: 'Create a password (min 10 characters)',
      required: true,
      secureTextEntry: true
    },
    {
      id: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password*',
      placeholder: 'Re-enter your password',
      required: true,
      secureTextEntry: true
    },
    {
      id: 'tosAccept',
      type: 'checkbox',
      label: 'I agree to the Terms of Service',
      required: true,
      linkType: 'terms'
    },
    {
      id: 'privacyPolicyAccept',
      type: 'checkbox',
      label: 'I agree to the Privacy Policy',
      required: true,
      linkType: 'privacy'
    }
  ];

  const handleChange = (id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
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
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!formData[field.id as keyof typeof formData]) {
            errors[field.id] = `You must accept the ${field.label.includes('Terms') ? 'Terms of Service' : 'Privacy Policy'}`;
          }
        } else {
          if (!formData[field.id as keyof typeof formData]) {
            errors[field.id] = `${field.label.replace('*', '')} is required`;
          } else if (field.id === 'email' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
          } else if (field.id === 'password' && formData.password.length < 10) {
            errors.password = 'Password must be at least 10 characters';
          } else if (field.id === 'confirmPassword' && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
          } 
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      const response = await dispatch(signupRequest(formData));
      if (response.payload) { 
        Toast.show('Registration successful!', Toast.LONG);
      }
    } catch (error:any) {
      console.log(error,"errorerrorerror")
      Toast.show(error.toString(), Toast.LONG);
    }
  };

  const handleLinkPress = (type: 'terms' | 'privacy') => {
    Alert.alert(`View ${type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}`);
  };

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <View key={field.id} style={field.halfWidth ? styles.halfWidthField : null}>
              <CustomTextInput
                label={field.label}
                placeholder={field.placeholder}
                value={formData[field.id as keyof typeof formData] as string}
                onChangeText={(text: string) => handleChange(field.id, text)}
                secureTextEntry={field.secureTextEntry}
                keyboardType={field.keyboardType}
                autoCapitalize={field.autoCapitalize}
                error={validationErrors[field.id]}
              />
          </View>
        );
      case 'checkbox':
        return (
          <CustomCheckbox
            key={field.id}
            label={
              <Text>
                {field.label.replace('Terms of Service', '').replace('Privacy Policy', '')}
                <Text 
                  style={styles.link} 
                  onPress={() => handleLinkPress(field.linkType!)}
                >
                  {field.label.includes('Terms') ? 'Terms of Service' : 'Privacy Policy'}
                </Text>
              </Text>
            }
            checked={formData[field.id as keyof typeof formData] as boolean}
            onChange={(checked: boolean) => handleChange(field.id, checked)}
            error={validationErrors[field.id]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Account</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.formContainer}>
        {formFields.slice(0, 1).map(renderFormField)}
        
        <View style={styles.nameRow}>
          {formFields.slice(1, 3).map(renderFormField)}
        </View>
        
        {formFields.slice(3, 6).map(renderFormField)} {/* Updated to include confirmPassword */}
        {formFields.slice(6).map(renderFormField)}
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
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
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidthField: {
    width: '48%',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: 24,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default SignUp;