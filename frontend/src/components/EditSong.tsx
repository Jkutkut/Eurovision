import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import UserScore from '../models/UserScore';
import Song from '../models/Song';

interface Props {
  song: Song;
  userScore: UserScore;
  saveCallback: (userScore: UserScore) => void;
  cancelCallback: () => void;
}

const EditSong = ({song: songObj, userScore, saveCallback, cancelCallback}: Props) => {
  // TODO use form hook
  const { artist, country, song } = songObj;
  const [ nick, setNick ] = useState(userScore.nickname);
  const [ notes, setNotes ] = useState(userScore.notes);

  console.debug("Edit song: " + country);

  const save = () => {
    saveCallback({
      ...userScore,
      nickname: nick,
      notes
    });
  };
  return (
    <Modal
      show={true}
      onHide={cancelCallback}
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{country}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            Artist: <i>{artist}</i>
          </div>
          <div className="col">
            Song: <i>{song}</i>
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
