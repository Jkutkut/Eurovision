import { useEffect, useState } from "react";

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
        <div className="row align-items-start" key={item.country}>
          <div className="col">{item.country}</div>
          <div className="col">{item.artist}</div>
          <div className="col">{item.song}</div>
          <div className="col"><a href={item.link} target="_blank">Link</a></div>
          <div className="col">{myData[index]['points']}</div>
        </div>
      ))}
    </div>
  </>);
}

const logout = () => {
  localStorage.removeItem('login');
  window.location.reload();
};

export default MainPage;