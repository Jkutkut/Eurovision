import {useEffect, useState} from "react";
import SongData from "../models/SongData";
import Song from "../models/Song";

interface Props {
  user: string
}

interface useRestAPIHook {
  myData: SongData[];
  setMyData: (data: SongData[]) => void,
  isLoading: boolean
};

const useRestAPI = ({user}: Props) => {
  const MY_URL = `http://${window.location.hostname}:9000/`; // TODO
  const GET_DATA_URL = `${MY_URL}api/${user}`;
  const POST_DATA_URL = GET_DATA_URL;
  const [ data, setData ] = useState<SongData[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const setMyData = (data: SongData[]) => {
    setData(data);
    uploadSongData(data);
  };

  const uploadSongData = (myData: SongData[]) => {
    console.debug("Upload song data");
    let data: string = JSON.stringify(myData);
    fetch(POST_DATA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
  };

  useEffect(() => {
    fetch(GET_DATA_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json())
      .then(data => {
        console.debug("Data from server", data);
        setData(json2SongData(data));
        setIsLoading(false);
      });
  }, []);

  return {
    myData: data,
    setMyData,
    isLoading
  } as useRestAPIHook;
};

const json2SongData = (json: any): SongData[] => {
  return json.map((item: any) => new SongData(
    new Song(
      item.song.country,
      item.song.artist,
      item.song.song,
      item.song.link
    ),
    item.points,
    item.nickname,
    item.notes
  ));
};

export default useRestAPI;
