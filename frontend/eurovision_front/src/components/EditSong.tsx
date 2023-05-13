import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SongData from '../models/SongData';
import { useState } from 'react';

interface Props {
  songData: SongData;
  pointsAvailable: number[];
  saveCallback: (newSongData: SongData) => void;
  cancelCallback: () => void;
}

const EditSong = ({songData, pointsAvailable, saveCallback, cancelCallback}: Props) => {
  const [ nick, setNick ] = useState(songData.nickname);
  const [ points, setPoints ] = useState(songData.points);
  const [ notes, setNotes ] = useState(songData.notes);

  const save = () => {
    let newSongData = songData;
    // const nickContainer = document.getElementById("nickname") as HTMLInputElement;
    // const pointsContainer = document.getElementById("points") as HTMLSelectElement;
    // const notesContainer = document.getElementById("notes") as HTMLTextAreaElement;
    // newSongData.nickname = nickContainer.value;
    // newSongData.points = parseInt(pointsContainer.value);
    // newSongData.notes = notesContainer.value;
    newSongData.nickname = nick;
    newSongData.points = points;
    newSongData.notes = notes;
    saveCallback(newSongData);
  };
  return (
    <Modal
      show={true}
      onHide={cancelCallback}
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{songData.song.country}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            Artist: <i>{songData.song.artist}</i>
          </div>
          <div className="col">
            Song: <i>{songData.song.song}</i>
          </div>
        </div>

        <br />
        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input type="text" className="form-control" placeholder="The name they'll be remembered by"
            id="nickname" aria-describedby="nicknameHelp"
            value={nick} onChange={(e) => setNick(e.target.value)}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="points">Points</label>
          <select className="form-control" id="points" onChange={(e) => setPoints(parseInt(e.target.value))}>
            <option value={SongData.NO_POINTS}>No points</option>
            <option value={0}>0</option>
            {pointsAvailable.map((item: number) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea className="form-control" id="notes" rows={3}
            value={notes} onChange={(e) => setNotes(e.target.value)}/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelCallback}>
          Cancel
        </Button>
        <Button variant="primary" onClick={save}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSong;