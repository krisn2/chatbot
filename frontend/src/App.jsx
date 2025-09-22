import React from 'react';
import { useRecoilValue } from 'recoil';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Dashboard from './components/Dashboard';
import ChatScreen from './components/ChatScreen';
import { viewState } from './recoil/atmos';

const App = () => {
  const view = useRecoilValue(viewState);

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
