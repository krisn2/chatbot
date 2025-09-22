import React from 'react';
import { useSetRecoilState } from 'recoil';
import { viewState, userState, projectsState } from '../recoil/atmos';
import { loginUser, getProjects } from '../api/api';
import AuthForm from './AuthForm';

const LoginScreen = () => {
  const setUser = useSetRecoilState(userState);
  const setView = useSetRecoilState(viewState);
  const setProjects = useSetRecoilState(projectsState);

  const handleLogin = async ({ email, password }) => {
    try {
      await loginUser(email, password);
      setUser({ email, name: 'User' });
      const projectsData = await getProjects();
      setProjects(projectsData);
      setView('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // You can add a state to show an error message to the user here
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { name: 'email', label: 'Email Address', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
      ]}
      onSubmit={handleLogin}
      submitText="Login"
      toggleView={() => setView('register')}
      toggleText="Don't have an account? Register"
    />
  );
};

export default LoginScreen;
