import {useEffect, useState} from "react";
import SongData from "../models/SongData";
import Song from "../models/Song";
import useLogin from "./useLogin";

const API  = {
  // TODO handle host + port
  host: () => `http://${window.location.hostname}:9000`,
  v1: {
    getDataUser: (user: string) => `${API.host()}/api/v1/${user}`,
    postDataUser: (user: string) => `${API.host()}/api/v1/${user}`
  },
  v2: {
    getUsers: () => `${API.host()}/api/v2/users`,
    getScores: (user: string) => `${API.host()}/api/v2/scores?u=${user}`,
    postUser: (user: string) => `${API.host()}/api/v2/user?u=${user}`,
    putScores: (user: string) => `${API.host()}/api/v2/scores?u=${user}`,
    harakiri: () => `${API.host()}/api/v2/harakiri`
  }
};

interface useRestAPIHook {
  user: string | null;
  login: (user: string) => void,
  logout: () => void,
  myData: SongData[];
  setMyData: (data: SongData[]) => void,
  isLoading: boolean
};

const useRestAPI = () => {
  const {user, login: logUser, logout} = useLogin();
  const [ data, setData ] = useState<SongData[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const login = (username: string) => {
    if (user != null) {
      return;
    }
    fetch(API.v2.postUser(username), {method: 'POST'})
    .then(r => {
      if (r.ok) {
        logUser(username);
      }
      else {
        throw new Error("Login failed");
      }
    });
  };

  const setMyData = (data: SongData[]) => {
    setData(data);
    uploadSongData(data);
  };

  const uploadSongData = (myData: SongData[]) => {
    if (user == null) {
      return;
    }
    console.debug("Upload song data");
    let data: string = JSON.stringify(myData);
    fetch(API.v1.postDataUser(user), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
  };

  useEffect(() => {
    if (user == null) {
      return;
    }
    fetch(API.v1.getDataUser(user), {
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
  }, [ user ]);

  return {
    user,
    login,
    logout,
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
