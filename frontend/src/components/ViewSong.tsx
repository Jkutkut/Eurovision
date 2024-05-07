import { useState } from "react";
import SongData from "../models/SongData";

interface Props {
  songData: SongData;
  editCallback: (country: string) => void;
}

const ViewSong = ({ songData, editCallback }: Props) => {
  const [ expanded, setExpanded ] = useState(false);

  const {nickname, points, notes} = songData;
  const { artist, song, country: fullCountry, link } = songData.song;
  const countryWords = fullCountry.split(" ");
  const [ countryFlag ] = countryWords;
  const country = countryWords.slice(1).join(" ");

  const toggleExpanded = () => setExpanded(!expanded);
  const editSong = () => editCallback(songData.song.country);

  const hasBeenEdited = nickname != "" || points != SongData.NO_POINTS || notes != "";

  return <>
    <div className="card" style={{"touchAction": "none"}}>
      <div className="card-body" onClick={toggleExpanded}>
        <div className="row d-flex align-items-center">
          <div className="col text-truncate">
            {countryFlag} {nickname || `${country} - ${song}`}
          </div>
          {points != SongData.NO_POINTS &&
            <div className="col-3 text-end text-nowrap text-truncate">
              {points} points
            </div>
          }
          {!hasBeenEdited &&
            <div className="col-2 text-end">
              <button className="btn btn-primary btn-sm" onClick={editSong}>Edit</button>
            </div>
          }
        </div>
      </div>
      <div className={`card-footer collapse ${expanded ? "show" : ""}`}>
        <div className="card-body">
          <div className="row">
            <div className="col">
              {countryFlag} {country}
            </div>
            <div className="col text-end">
              🎵 <a href={link} target="_blank" rel="noreferrer">YouTube</a> 🎵
            </div>
          </div>
          <div className={nickname && "text-decoration-line-through" || "mt-3"}>
            <div className="row">
              <div className="col">
                <i>{song}</i>
              </div>
            </div>
            <div className="row">
              <div className="col">
                By: <i>{artist}</i>
              </div>
            </div>
          </div>
          {nickname && <div className="row">
            <div className="col">
              AKA: <i>{nickname}</i>
            </div>
          </div>}
          {notes != "" &&
            <div className="row mt-3">
              <div className="col-12">
                <div className="h6">Notes</div>
                {notes.split("\n").map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          }
          <div className="row mt-3">
            <button className="btn btn-primary" onClick={editSong}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </>;
}

export default ViewSong;
