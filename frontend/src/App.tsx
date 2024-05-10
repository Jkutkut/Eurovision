import {useSearchParams} from 'react-router-dom';
import useRestAPI from './hooks/useRestAPI';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import ViewSong from './components/ViewSong';
import Song from './models/Song';
import {NO_POINTS} from './models/UserScore';

const App = () => {
  const [searchParams] = useSearchParams();
  const restAPI = useRestAPI();
  const { user, login } = restAPI;
  if (user == null) {
    return (
      <Login login={login} />
    );
  }

  const users = ["Marvin", "Jkutkut", "Marvin2", "Jkutkut2", "Marvin3", "Jkutkut3"]; // TODO get from REST API
  const isAdmin = searchParams.get('admin') !== null;
  if (isAdmin) {
    const harakiri = () => {
      console.warn("Admin harakiri");
      // TODO
      console.warn("TODO");
    };
    return <>
      <div className='p-3 d-flex flex-column gap-3'>
        <div className="alert alert-info">
          Admin mode.
        </div>
        <div>
          <div className="h5">
            Users:
          </div>
          <div className="list-group">
            {users.map((user) => (
              <div key={user}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {user}
                </div>
                <div className="text-end">
                  XX scores
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex gap-3">
          <div className="col">
            <button
              className="btn btn-primary"
              onClick={harakiri}
            >
              Refresh
            </button>
          </div>
          <div className="col text-end">
            <button
              className="btn btn-danger"
              onDoubleClick={harakiri}
            >
              Harakiri (double click)
            </button>
          </div>
        </div>
      </div>
    </>;
  }

  const isDashboard = searchParams.get('dashboard') !== null;
  if (isDashboard) {
    return <>
      <div className='p-3 d-flex flex-column gap-3'>
        <div className="alert alert-info">
          Dashboard mode.
        </div>
        <div className="">
          {restAPI.euroInfo?.countries
            .filter((_: Song, idx: number) => restAPI.userScores[idx].points !== NO_POINTS)
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
        <div className="d-flex flex-wrap justify-content-center">
          {users.map((user) => (
            <div key={user}
              className="card d-flex flex-row m-2 p-3 ps-3 justify-content-between col-5"
              style={{
              }}
            >
              <div>
                {user}
              </div>
              <div className="">
                <input type="checkbox" className="ms-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>;
  }

  return <>
    <MainPage restAPI={restAPI} />
  </>;
}

export default App;
