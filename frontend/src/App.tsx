import useLogin from './hooks/useLogin';
import Login from './pages/Login';
import MainPage from './pages/MainPage';

const App = () => {
  let { user, login } = useLogin();
  if (user == null) {
    return (
      <Login login={login} />
    );
  }

  return <>
    <MainPage user={user} />
  </>;
}

export default App;
