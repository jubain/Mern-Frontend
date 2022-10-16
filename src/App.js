import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
  const { token, userId, login, logout, isCheckingAuth } = useAuth();

  let routes

  if (token) {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path="places/new" element={<NewPlace />} />
        <Route path="places/:placeId/update" element={<UpdatePlace />} />
        <Route path="*" element={<Users />} />
      </>
    )
  } else {
    routes = (
      <>
        <Route path="/" element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <MainNavigation />
      <main>
        {isCheckingAuth ? <LoadingSpinner /> :
          <Suspense fallback={<div className='center'>
            <LoadingSpinner />
          </div>}>
            <Routes>
              {routes}
            </Routes>
          </Suspense>
        }
      </main>
    </AuthContext.Provider>
  )
};

export default App;
