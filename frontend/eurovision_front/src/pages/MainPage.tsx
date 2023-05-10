import { useEffect, useState } from "react";
import Song from "../components/Song";

interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {

  const [ isLoading, setIsLoading ] = useState(true);
  const [ data, setData ] = useState([]);
  const [ myData, setMyData ] = useState([]);

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

  console.log(data);
  console.log(myData);

  return (<>
    <p>Welcome {user}!</p>
    <button onClick={logout}>Logout</button>
    <h2>GROUPS</h2>
    <div className="container text-center">
      {data.map((item: any, index: number) => (
        <Song
          country={item.country}
          artist={item.artist}
          song={item.song}
          link={item.link}
          points={myData[index]['points']}
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