import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Favorites from './pages/Favorites';
import AddBook from './pages/AddBook';
import Profile from './pages/Profile';
import Exchanges from './pages/Exchanges';
import Chat from './pages/Chat';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Insights from './pages/Insights';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import AppShell from './components/layout/AppShell';
import LoadingScreen from './components/common/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status } = useAuth();
  if (status === 'bootstrapping') {
    return <LoadingScreen label="Preparing your library…" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }
  return children;
};

const AuthLayout = ({ children }) => (
  <div className="flex min-h-[70vh] items-center justify-center">{children}</div>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/insights" element={<Insights />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exchanges"
        element={
          <ProtectedRoute>
            <Exchanges />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route
      path="/auth/signin"
      element={
        <AuthLayout>
          <SignIn />
        </AuthLayout>
      }
    />
    <Route
      path="/auth/signup"
      element={
        <AuthLayout>
          <SignUp />
        </AuthLayout>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppDataProvider>
            <AppRoutes />
          </AppDataProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

