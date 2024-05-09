import useRestAPI from './hooks/useRestAPI';
import Login from './pages/Login';
import MainPage from './pages/MainPage';

const App = () => {
  const restAPI = useRestAPI();
  const { user, login } = restAPI;
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
