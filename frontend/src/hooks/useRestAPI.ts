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
    getEuroInfo: () => `${API.host()}/api/v2/eurovision/info`,
    postUser: (user: string) => `${API.host()}/api/v2/user?u=${user}`,
    putScores: (user: string) => `${API.host()}/api/v2/scores?u=${user}`,
    harakiri: () => `${API.host()}/api/v2/harakiri`
  }
};

interface useRestAPIHook {
  user: string | null;
  login: (user: string) => void,
  logout: () => void,
  euroInfo: any[], // TODO model
  userScores: any[], // TODO model
  save: (userScores: any) => void, // TODO model
  isLoading: boolean
};

const useRestAPI = () => {
  const {user, login: logUser, logout} = useLogin();
  const [ euroInfo, setEuroInfo ] = useState<any | null>(null);
  const [ userScores, setUserScores ] = useState<any[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

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

  const getEuroInfo = () => {
    if (euroInfo !== null) {
      return;
    }
    console.debug("Getting euro info");
    fetch(API.v2.getEuroInfo(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => setEuroInfo(data));
  };

  const getScores = (user: string) => {
    console.debug("Getting scores for " + user);
    fetch(API.v2.getScores(user), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => setUserScores(data));
  };

  const save = (userScores: any) => { // TODO model
    fetch(API.v2.putScores(user), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userScores)
    })
    .then(r => {
      if (r.ok) {
        console.debug("Scores saved");
        setUserScores(userScores);
      }
      else {
        console.error("Scores saving failed");
      }
    });
  };

  useEffect(() => {
    if (user == null) {
      return;
    }
    setIsLoading(true);
    getEuroInfo();
    getScores(user);
  }, [user]);

  useEffect(() => {
    const currentIsLoading = user == null ||
      (euroInfo == null || userScores.length == 0);
    if (currentIsLoading != isLoading) {
      setIsLoading(currentIsLoading);
    }
  }, [user, euroInfo, userScores]);

  return {
    user,
    login,
    logout,
    euroInfo,
    userScores,
    save,
    isLoading
  } as useRestAPIHook;
};

export default useRestAPI;
