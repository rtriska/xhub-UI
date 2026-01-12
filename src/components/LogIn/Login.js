import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LoginContainer,
  LeftContainer,
  Logo,
  LeftImage,
  RightContainer,
  TopContainer,
  TopText,
  TopButton,
  MainContainer,
  Section,
  SectionText,
  SubmitButton
} from './styled/LoginStyles';

import Brand from '../common/Brand';
import EmailField from './components/EmailField';
import PasswordField from './components/PasswordField';
import ConfirmPasswordField from './components/ConfirmPasswordField';
import SocialLoginButtons from './components/SocialLoginButtons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const isLogin = window.location.pathname.includes('log-in');

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [email, password, confirmPassword, emailError, passwordError]);

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value;
  
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters long and contain numbers.');
    } else if (value !== confirmPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);
    if (password !== value) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const validateForm = () => {
    if (!validateEmail(email)) {
      return false;
    }
    if (!validatePassword(password)) {
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    if (isLogin) {
      logIn();
    } else {
      signUp();
    }
  };

  const logIn = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/auth/sign_in`, {
      user: {    
        email: email,
        password: password
      }
    }).then(response => {
      console.log('***********************signup***************', response);
      localStorage.setItem('authToken', response.data.authentication_token);
      navigate('/');
    });
  };

  const signUp = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/users/registrations`, {
      registration: {
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      }
    }).then(response => {
      console.log('***********************signup***************', response);
      navigate('/log-in');
    }).catch(error => {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    });
  };

  return (
    <LoginContainer>
      <LeftContainer>
        <Logo href="/">
          <Brand />
        </Logo>
        <LeftImage src="login.png" alt="Login page" draggable="false" />
      </LeftContainer>
      <RightContainer>
        <TopContainer>
          {isLogin ? (
            <>
              <TopText>Don’t have an account?</TopText>
              <TopButton href="/sign-up">Get Started</TopButton>
            </>
          ) : (
            <>
              <TopText>Already have an account?</TopText>
              <TopButton href="/log-in">Log in</TopButton>
            </>
          )}
        </TopContainer>
        <MainContainer>
          <Section onSubmit={handleSubmit}>
            <SectionText>{isLogin ? 'Log in to Sports Hub' : 'Create Account'}</SectionText>
            <SocialLoginButtons />
            <EmailField email={email} handleEmailChange={handleEmailChange} emailError={emailError} />
            <PasswordField password={password} handlePasswordChange={handlePasswordChange} isLogin={isLogin} />
            {!isLogin && (
              <ConfirmPasswordField confirmPassword={confirmPassword} handleConfirmPasswordChange={handleConfirmPasswordChange} passwordError={passwordError} />
            )}
            <SubmitButton type="submit" disabled={!isFormValid}>{isLogin ? 'Log in' : 'Sign up'}</SubmitButton>
          </Section>
        </MainContainer>
      </RightContainer>
    </LoginContainer>
  );
};

export default Login;
