import { useEffect, useState } from "react";
import Song from "../components/Song";
import ClickAwayListener from "react-click-away-listener";
import EditSong from "../components/EditSong";

interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {

  const [ isLoading, setIsLoading ] = useState(true);
  const [ data, setData ] = useState([]);
  const [ myData, setMyData ] = useState([]);
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
        setData(data.countries);
        let dataStr = localStorage.getItem('myData');
        let dataArr = [];
        if (dataStr) {
          dataArr = JSON.parse(dataStr);
        }

        if (dataArr.length === 0) {
          for (let i = 0; i < data.countries.length; i++) {
            dataArr.push({
              country: data.countries[i]['country'],
              points: 0
            });
          }
          localStorage.setItem('myData', JSON.stringify(dataArr));
        }
        setMyData(dataArr);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  const editSong = (country: string) => {
    console.log("Edit song: " + country);
    let song: number = -1;
    for (let i = 0; i < data.length; i++) {
      if (country == data[i]['country']) {
        song = i;
        break;
      }
    }
    if (song == -1)
      throw new Error("UPS, i can't find the country");
    setEditorSong(song);
  };

  return (<>
    <p>Welcome {user}!</p>
    <button onClick={logout}>Logout</button>
    {editorSong != -1 &&
      <EditSong
        song={data[editorSong]}
        songData={myData[editorSong]}
        cancelCallback={() => setEditorSong(-1)}
        saveCallback={(newSongData: any) => setEditorSong(-1)}
      />
    }
    <h2>GROUPS</h2>
    <div key="song-list" className="container text-center">
      {data.map((item: any, index: number) => (
        <Song
          key={item.country}
          country={item.country}
          artist={item.artist}
          song={item.song}
          link={item.link}
          points={myData[index]['points']}
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