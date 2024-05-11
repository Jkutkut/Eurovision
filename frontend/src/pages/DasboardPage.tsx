import {useEffect, useMemo, useState} from "react";
import ViewSong from "../components/ViewSong";
import useRestAPI from "../hooks/useRestAPI";
import User from "../models/User";
import {NO_POINTS} from "../models/UserScore";
import CheckableUser from "../components/CheckeableUser";

interface Props {
  restAPI: ReturnType<typeof useRestAPI>;
};

const DashboardPage = ({restAPI: { isLoading, euroInfo, users, getUsers }}: Props) => {
  const [ activeUsers, setActiveUsers ] = useState<number[]>([]); // TODO model

  const toogleUser = (user: User) => {
    console.debug(user);
    if (activeUsers.includes(user.id)) {
      setActiveUsers(activeUsers.filter(id => id !== user.id));
    }
    else {
      setActiveUsers([...activeUsers, user.id]);
    }
  };

  const songScores: any[] = useMemo(() => {
    if (isLoading || !users || !euroInfo) {
      return [];
    }
    const songs = euroInfo.countries;
    const songScores = Array(songs.length).fill(null)
      .map((_, idx) => ({song_id: idx, points: 0}));
    for (const user of users) {
      if (!activeUsers.includes(user.id)) {
        continue;
      }
      for (const score of user.scores) {
        if (score.points == NO_POINTS) {
          break;
        }
        songScores[score.song_id].points += score.points;
      }
    }
    songScores.sort((a, b) => b.points - a.points);
    return songScores;
  }, [users, euroInfo, activeUsers, isLoading]);

  useEffect(() => getUsers(), []);

  if (isLoading || !euroInfo || !users) {
    return <div>Loading...</div>;
  }
  const songs = euroInfo.countries;
  console.debug(
    "users", users,
    "songs", songs,
    "songScores", songScores,
    "activeUsers", activeUsers
  );

  return <>
    <div style={{
      minHeight: "100vh",
      maxHeight: "100vh",
      overflowY: "hidden"
    }}>
      <div className='p-3 d-flex flex-column gap-3'
        style={{
          maxHeight: "70vh",
          overflowY: "auto"
        }}
      >
        {songScores
          .map((songScore: any, idx: number) => (
          <ViewSong key={idx}
            song={songs[songScore.song_id]}
            songScore={{ // TODO
              song_id: idx,
              nickname: "",
              notes: "",
              points: songScore.points
            }}
            editCallback={() => {}}
          />
        ))}
      </div>
      <div
        className="p-3"
        style={{
          maxHeight: "30vh",
          overflowY: "auto"
        }}
      >
        <div className="d-flex gap-3 pb-3">
          <div className="col">
            <button
              className="btn btn-primary w-100"
              onClick={getUsers}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {users.map((user: User, idx: number) => (
            <CheckableUser
              key={idx}
              user={user}
              isActiveUser={activeUsers.includes(user.id)}
              toogleUser={() => toogleUser(user)}
              isEven={idx % 2 == 0}
            />
          ))}
        </div>
      </div>
    </div>
  </>;
};

export default DashboardPage;
