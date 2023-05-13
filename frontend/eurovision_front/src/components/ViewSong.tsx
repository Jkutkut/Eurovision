import { useState } from "react";
import SongData from "../models/SongData";

interface Props {
  songData: SongData;
  editCallback: (country: string) => void;
}

const ViewSong = ({ songData, editCallback }: Props) => {
  const [ expanded, setExpanded ] = useState(false);

  const songId = songData.song.country + "ViewContent";
  const controlId = songData.song.country + "ViewControl";

  return (
    <div className="card">
      <div className="card-header" id={controlId}>
        <div className="row">
          <div className="col-8">
            <button className="btn" onClick={() => setExpanded(!expanded)}>
              { songData.nickname != "" ?
                <>{songData.nickname} <del>{songData.song.country}</del></>
                :
                songData.song.country
              }
            </button>
          </div>
          <div className="col-2">
            {songData.points != SongData.NO_POINTS &&
              <button className="btn">{songData.points}</button>
            }
          </div>
          <div className="col-2">
            <button className="btn btn-primary" onClick={() => editCallback(songData.song.country)}>
              Edit
            </button>
          </div>
        </div>
      </div>
      <div id={songId} className={`collapse ${expanded ? "show" : ""}`}>
        <div className="card-body">
          <div className="row">
            <div className="col">
              Artist: <i>{songData.song.artist}</i>
            </div>
            <div className="col">
              Song: <i>{songData.song.song}</i>
            </div>
          </div>
          <div className="row">
            <div className="col">
              🎵<a href={songData.song.link}>YouTube</a>🎵
            </div>
          </div>
          {songData.notes != "" &&
            <>
            <br/>
            <div className="row">
              <div className="col-12">
                <h5 className="card-title">Notes</h5>
                <p>{songData.notes}</p>
              </div>
            </div></>
          }
        </div>
      </div>
    </div>
  );
}

export default ViewSong;