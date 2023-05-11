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
    fetch('http://localhost:9000/eurovision.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        console.log("Data from server");
        let countries: Song[] = data.countries.map((item: any) => Song.fromJSON(item));

        // let storedUser = localStorage.getItem('user');
        // if (storedUser != null && storedUser != user) {
        //   console.log("User changed, reset data");
        //   localStorage.removeItem('myData');
        // }
        // let dataStr = localStorage.getItem('myData');
        // let dataArr = [];
        // if (dataStr) {
        //   dataArr = JSON.parse(dataStr);
        // }
        // if (dataArr.length === 0) {
        //   for (let i = 0; i < data.countries.length; i++) {
        //     dataArr.push({
        //       country: data.countries[i]['country'],
        //       points: 0
        //     });
        //   }
        //   localStorage.setItem('myData', JSON.stringify(dataArr));
        // }
        // TODO persistency

        let myData: SongData[] = countries.map((item: Song) => new SongData(item));
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

  return (<>
    <p>Welcome {user}!</p>
    <button onClick={logout}>Logout</button>
    {editorSong != -1 &&
      <EditSong
        songData={myData[editorSong]}
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