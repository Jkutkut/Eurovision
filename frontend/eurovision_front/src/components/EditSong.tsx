import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SongData from '../models/SongData';
import { useState } from 'react';

interface Props {
  songData: SongData;
  saveCallback: (newSongData: SongData) => void;
  cancelCallback: () => void;
}

const EditSong = ({songData, saveCallback, cancelCallback}: Props) => {
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
          <select className="form-control" id="points">
            <option value={SongData.NO_POINTS}>No points</option>
            <option value={12}>12</option>
            <option value={10}>10</option>
            <option value={8}>8</option>
            <option value={7}>7</option>
            <option value={6}>6</option>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
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