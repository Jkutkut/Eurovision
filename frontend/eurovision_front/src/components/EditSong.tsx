import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  song: any;
  songData: any;
  saveCallback: (newSongData: any) => void;
  cancelCallback: () => void;
}

const EditSong = ({song, songData, saveCallback, cancelCallback}: Props) => {
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
        <Modal.Title>{song.country}</Modal.Title>
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