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
  // TODO use form hook
  const [ nick, setNick ] = useState(songData.nickname);
  const [ notes, setNotes ] = useState(songData.notes);

  const save = () => {
    let newSongData = songData;
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
          <label htmlFor="notes">Notes</label>
          <textarea className="form-control" id="notes" rows={3}
            placeholder="Anything you want to remember about this song"
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
