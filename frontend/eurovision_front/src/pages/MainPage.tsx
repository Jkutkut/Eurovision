import { useEffect, useState } from "react";
import ViewSong from "../components/ViewSong";
import EditSong from "../components/EditSong";

import Song from "../models/Song";
import SongData from "../models/SongData";

interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {
  const [ myData, setMyData ] = useState<SongData[]>([]);
  const [ editorSong, setEditorSong ] = useState(-1);

  useEffect(() => {
    let url = window.location.href.replace(/:\d+/, ':9000');
    // fetch(`${url}eurovision.json`, {
    fetch(`${url}api/${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        console.log("Data from server", data);
        let myData: SongData[] = [];
        for (let i = 0; i < data.length; i++) {
          myData.push(new SongData(
            new Song(
              data[i].song.country,
              data[i].song.artist,
              data[i].song.song,
              data[i].song.link
            ),
            data[i].points,
            data[i].nickname,
            data[i].notes
          ));
        }
        setMyData(myData);
      });
  }, []);

  const isLoading = myData.length == 0;
  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  const editSong = (country: string) => {
    console.log("Edit song: " + country);
    let song: number = -1;
    for (let i = 0; i < myData.length; i++) {
      if (country == myData[i].song.country) {
        song = i;
        break;
      }
    }
    if (song == -1)
      throw new Error("UPS, i can't find the country");
    setEditorSong(song);
  };

  const saveSongData = (newSongData: SongData) => {
    console.log("Update song data", newSongData);
    let i: number;

    for (i = 0; i < myData.length; i++) {
      if (myData[i].song.country == newSongData.song.country) {
        break;
      }
    }
    if (i == myData.length)
      throw new Error("UPS, i can't find the country");
    myData[i] = newSongData;
    let data: string = JSON.stringify(myData);
    fetch(`http://localhost:9000/api/${user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    })
      // .then(response => response.json())
      // .then(data => {
      //   console.log("Data from server");
      //   let countries: Song[] = data.countries.map((item: any) => Song.fromJSON(item));
      //   let myData: SongData[] = countries.map((item: Song) => new SongData(item));
      //   setMyData(myData);
      // });
    setMyData(myData);
    console.log("Song data updated", i);
    setEditorSong(-1);
  };

  const ptsAvailable = pointsAvailable(myData);

  return (<>
    <p>Welcome {user}!</p>
    <button onClick={logout}>Logout</button>
    {editorSong != -1 &&
      <EditSong
        songData={myData[editorSong]}
        pointsAvailable={pointsAvailableSong(ptsAvailable, myData[editorSong])}
        cancelCallback={() => setEditorSong(-1)}
        saveCallback={saveSongData}
      />
    }
    <div key="song-list" className="container text-center">
      {myData.map((item: SongData) => (
        <ViewSong
          key={item.song.country}
          songData={item}
          editCallback={editSong}
        />
      ))}
    </div>
  </>);
}

const logout = () => {
  localStorage.removeItem('login');
  window.location.reload();
};

export default MainPage;

// TOOLS

function pointsAvailable(songs: SongData[]): number[] {
  let ptsAvailable: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
  for (let i = 0; i < songs.length; i++) {
    if (songs[i].points != SongData.NO_POINTS) {
      ptsAvailable = ptsAvailable.filter((item: number) => item != songs[i].points);
    }
  }
  return ptsAvailable;
}

function pointsAvailableSong(ptsAvailable: number[], song: SongData): number[] {
  if (song.points != SongData.NO_POINTS)
    return [...ptsAvailable, song.points];
  return ptsAvailable;
}