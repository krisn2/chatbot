import React from 'react';
import { useSetRecoilState } from 'recoil';
import { viewState, userState } from '../recoil/atmos';
import { registerUser } from '../api/api';
import AuthForm from './AuthForm';

const RegisterScreen = () => {
  const setUser = useSetRecoilState(userState);
  const setView = useSetRecoilState(viewState);

  const handleRegister = async ({ name, email, password }) => {
    try {
      await registerUser(name, email, password);
      setUser({ email, name });
      setView('login');
    } catch (error) {
      console.error('Registration failed:', error);
      // You can add a state to show an error message to the user here
    }
  };

  return (
    <AuthForm
      title="Register"
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email Address', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
      ]}
      onSubmit={handleRegister}
      submitText="Register"
      toggleView={() => setView('login')}
      toggleText="Already have an account? Login"
    />
  );
};

export default RegisterScreen;
