import {useSearchParams} from 'react-router-dom';
import useRestAPI from './hooks/useRestAPI';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import ViewSong from './components/ViewSong';
import Song from './models/Song';
import {useEffect} from 'react';
import AdminPage from './pages/adminPage';

const App = () => {
  const [searchParams] = useSearchParams();
  const restAPI = useRestAPI();
  const { user, login, users, getUsers } = restAPI;

  useEffect(() => getUsers(), []);

  const isAdmin = searchParams.get('admin') !== null;
  if (isAdmin) {
    return <AdminPage
      restAPI={restAPI}
    />
  }

  const isDashboard = searchParams.get('dashboard') !== null;
  if (isDashboard) {
    if (restAPI.isLoading) {
      return <div>Loading...</div>;
    }
    console.log(restAPI);
    return <>
      <div className='p-3 d-flex flex-column gap-3'>
        {restAPI.euroInfo?.countries
          .map((song: Song, idx: number) => (
          <ViewSong key={idx}
            song={song}
            songScore={{ // TODO
              song_id: idx,
              nickname: "",
              notes: "",
              points: restAPI.userScores[idx].points
            }}
            editCallback={() => {}}
          />
        ))}
      </div>
      <div className="d-flex flex-wrap justify-content-center fixed-bottom p-3">
        {users.map((user, idx) => (
          <div key={user} className="col-6">
            <div
              className={`card m-2 d-flex flex-row p-3 justify-content-between ${idx % 2 ? "me-0" : "ms-0"}`}
            >
              <div>
                {user}
              </div>
              <div className="">
                <input type="checkbox" className="ms-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>;
  }

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
