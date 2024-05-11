import {useEffect, useState} from "react";

import useLogin from "./useLogin";

import UserScore, {NO_POINTS} from "../models/UserScore";
import EurovisionInfo from "../models/EurovisionInfo";

const API  = {
  // TODO handle host + port
  host: (() => `http://${window.location.hostname}:9000`)(),
  v1: {
    getDataUser: (user: string) => `${API.host}/api/v1/${user}`,
    postDataUser: (user: string) => `${API.host}/api/v1/${user}`
  },
  v2: {
    getUsers: () => `${API.host}/api/v2/users`,
    getScores: (user: string) => `${API.host}/api/v2/scores?u=${user}`,
    getEuroInfo: () => `${API.host}/api/v2/eurovision/info`,
    postUser: (user: string) => `${API.host}/api/v2/user?u=${user}`,
    putScores: (user: string) => `${API.host}/api/v2/scores?u=${user}`,
    harakiri: () => `${API.host}/api/v2/harakiri`
  }
};

interface useRestAPIHook {
  user: string | null;
  login: (user: string) => void,
  logout: () => void,
  euroInfo: EurovisionInfo,
  userScores: UserScore[],
  users: any[],
  getUsers: () => void,
  save: (userScores: UserScore[], restSave?: boolean) => void,
  harakiri: () => void,
  isLoading: boolean
};

const useRestAPI = () => {
  const {user, login: logUser, logout} = useLogin();
  const [ euroInfo, setEuroInfo ] = useState<any | null>(null);
  const [ userScores, setUserScores ] = useState<any[]>([]);
  const [ loading, setLoading ] = useState<number>(0);
  const [ users, setUsers ] = useState<any[]>([]); // TODO model

  const isLoading = loading > 0;
  const startLoading = () => setLoading(l => l + 1);
  const endLoading = () => setLoading(l => l - 1);

  const login = (username: string) => {
    if (user != null) {
      return;
    }
    startLoading();
    fetch(API.v2.postUser(username), {method: 'POST'})
    .then(r => {
      if (r.ok) {
        logUser(username);
        endLoading();
      }
      else {
        throw new Error("Login failed");
      }
    });
  };

  const getEuroInfo = () => {
    if (!!euroInfo) {
      return;
    }
    startLoading();
    console.debug("Getting euro info");
    fetch(API.v2.getEuroInfo(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => setEuroInfo(data))
    .then(() => console.debug("Euro info loaded"))
    .finally(endLoading);
  };

  const getScores = (user: string) => {
    if (user == null) {
      return;
    }
    console.debug("Getting scores for " + user);
    startLoading();
    fetch(API.v2.getScores(user), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => setUserScores(data))
    .then(() => console.debug("Scores loaded"))
    .finally(endLoading);
  };

  const save = (userScores: UserScore[], restSave: boolean = false) => {
    if (user == null || euroInfo == null) {
      return;
    }
    const scores = userScores.map((score: any, idx: number) => {
      let points = score.points;
      if (points != NO_POINTS && idx < euroInfo.points.length) {
        points = euroInfo.points[idx];
      }
      return {
        ...score,
        points
      }
    });
    if (!restSave) {
      setUserScores(scores);
      return;
    }
    console.debug("Saving scores", scores);
    fetch(API.v2.putScores(user), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scores)
    })
    .then(r => {
      if (r.ok) {
        console.debug("Scores saved");
        setUserScores(scores);
      }
      else {
        console.error("Scores saving failed");
      }
    });
  };

  const getUsers = () => {
    startLoading();
    console.debug("Getting users");
    fetch(API.v2.getUsers(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => setUsers(data))
    .then(() => console.debug("Users loaded"))
    .finally(endLoading);
  };

  const harakiri = () => {
    console.warn("Harakiri");
    startLoading();
    fetch(API.v2.harakiri(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(r => {
      endLoading();
      if (!r.ok) {
        return;
      }
      if (users) {
        getUsers();
      }
      if (user) {
        logout();
      }
      if (userScores) {
        setUserScores([]);
      }
    });
  };

  useEffect(() => getEuroInfo(), []);
  useEffect(() => {
    if (user == null) {
      return;
    }
    getScores(user);
  }, [user]);

  return {
    user,
    login,
    logout,
    euroInfo,
    userScores,
    users,
    getUsers,
    save,
    harakiri,
    isLoading
  } as useRestAPIHook;
};

export default useRestAPI;
