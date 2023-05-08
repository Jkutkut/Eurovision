interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {
  const logout = () => {
    localStorage.removeItem('login');
    window.location.reload();
  };

  return (
    <div>
      <h1>Main Page</h1>
      <p>Welcome, {user}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default MainPage;