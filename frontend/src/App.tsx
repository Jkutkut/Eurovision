import Login from './pages/Login';
import MainPage from './pages/MainPage';

const App = () => {
  let login = localStorage.getItem('login');
  if (login == null) {
    return (
      <Login />
    );
  }

  return <>
    <MainPage user={login} />
  </>;
}

export default App;
