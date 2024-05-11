import { forwardRef, useState } from "react";
import Song from "../models/Song";
import UserScore, {NO_POINTS} from "../models/UserScore";

interface Props {
  song: Song;
  songScore: UserScore;
  editCallback: (song_id: number) => void;
  ref?: any;
}

const ViewSong = ({ song: songObj, songScore, editCallback, ref }: Props) => {
  const [ expanded, setExpanded ] = useState(false);

  const {nickname, points, notes} = songScore;
  const { song, artist, country: fullCountry, link } = songObj;
  const countryWords = fullCountry.split(" ");
  const [ countryFlag ] = countryWords;
  const country = countryWords.slice(1).join(" ");

  const toggleExpanded = () => setExpanded(!expanded);
  const editSong = (e: any) => {
    e.stopPropagation();
    editCallback(songScore.song_id);
  };

  const hasBeenEdited = nickname != "" || points != NO_POINTS || notes != "";

  return <>
    <div ref={ref} className="card" style={{"touchAction": "none"}}>
      <div className="card-body" onClick={toggleExpanded}>
        <div className="row d-flex align-items-center">
          <div className="col text-truncate pe-0">
            {countryFlag} {nickname || `${country} - ${song}`}
          </div>
          {points != NO_POINTS &&
            <div className="col-3 text-end text-nowrap text-truncate ps-0">
              {points} points
            </div>
          }
          {!hasBeenEdited &&
            <div className="col-3 text-end">
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
                {notes.split("\n").map((line: string, i: number) => <div key={i}>{line}</div>)}
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
};

const ViewSongRef = forwardRef((props: Props, ref) => {
  return <ViewSong {...props} ref={ref} />
});

export default ViewSong;
export { ViewSongRef };
