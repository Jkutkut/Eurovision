import {useSearchParams} from 'react-router-dom';
import useRestAPI from './hooks/useRestAPI';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DasboardPage';

const App = () => {
  const [searchParams] = useSearchParams();
  const restAPI = useRestAPI();

  const isAdmin = searchParams.get('admin') !== null;
  if (isAdmin) {
    return <AdminPage
      restAPI={restAPI}
    />;
  }

  const isDashboard = searchParams.get('dashboard') !== null;
  if (isDashboard) {
    return <DashboardPage
      restAPI={restAPI}
    />;
  }

  const {user, login} = restAPI;
  if (user == null) {
    return (
      <Login login={login} />
    );
  }

  return <>
    <MainPage restAPI={restAPI} />
  </>;
}

export default App;
