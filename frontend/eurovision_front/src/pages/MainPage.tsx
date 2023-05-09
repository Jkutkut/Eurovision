import { useState } from "react";

interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {

  const [euroData, setEuroData] = useState([]);

  if (euroData.length === 0) {
    fetch('http://localhost:9000/eurovision.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        setEuroData(data.countries);
      });
  }

  const logout = () => {
    localStorage.removeItem('login');
    window.location.reload();
  };

  let songs;
  if (euroData.length > 0) {
    songs = (<>
      <h2>GROUPS</h2>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Artist</th>
            <th>Song</th>
          </tr>
        </thead>
        <tbody>
          {euroData.map((item: any) => (
            <tr key={item.country}>
              <td>{item.country}</td>
              <td>{item.artist}</td>
              <td>{item.song}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>);
  }
  else {
    songs = <pre>Loading...</pre>
  }

  return (
    <div>
      <p>Welcome, {user}!</p>
      <button onClick={logout}>Logout</button>
      {songs}
    </div>
  );
}

export default MainPage;