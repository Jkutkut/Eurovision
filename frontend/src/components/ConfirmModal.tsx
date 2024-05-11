import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  title?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
  children?: React.ReactNode;
}

const ConfirmModal = ({
  title,
  cancelLabel, confirmLabel,
  confirmCallback, cancelCallback,
  children
}: Props) => {
  return (
    <Modal
      show={true}
      onHide={cancelCallback}
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelCallback}>
          {cancelLabel || "Cancel"}
        </Button>
        <Button variant="primary" onClick={confirmCallback}>
          {confirmLabel || "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
