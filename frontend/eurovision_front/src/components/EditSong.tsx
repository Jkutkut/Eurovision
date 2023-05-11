import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SongData from '../models/SongData';

interface Props {
  songData: SongData;
  saveCallback: (newSongData: SongData) => void;
  cancelCallback: () => void;
}

const EditSong = ({songData, saveCallback, cancelCallback}: Props) => {
  const save = () => {
    let newSongData = songData;
    // TODO
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
        <p>TODO</p>
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