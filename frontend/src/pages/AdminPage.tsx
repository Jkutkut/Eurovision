import {useEffect, useState} from 'react';
import User from '../models/User';
import UserScore, {NO_POINTS} from '../models/UserScore';
import ConfirmModal from '../components/ConfirmModal';
import useRestAPI from '../hooks/useRestAPI';


interface Props {
  restAPI: ReturnType<typeof useRestAPI>;
};

const AdminPage = ({restAPI: { users, getUsers, euroInfo, harakiri, isLoading }}: Props) => {
  const [ refreshed, setRefreshed ] = useState<boolean>(false);
  const [ harakiriModal, setHarakiriModal ] = useState<boolean>(false);

  useEffect(getUsers, []);

  const refresh = () => {
    getUsers();
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1000);
  };
  return <>
    {harakiriModal &&
      <ConfirmModal
        title="Are you sure?"
        cancelLabel="No"
        confirmLabel="Yes"
        cancelCallback={() => setHarakiriModal(false)}
        confirmCallback={harakiri}
      >
        <div>
          <p>
            Are you sure you want to harakiri?
          </p>
        </div>
      </ConfirmModal>
    }
    <div className='p-3 d-flex flex-column gap-3'>
      <div className="alert alert-info">
        Admin mode.
      </div>
      <div>
        <div className="h5">
          Users:
        </div>
        <div className="list-group">
          {users.map((user: User) => (
            <div key={user.name}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                {user.name}
              </div>
              <div className="text-end">
                {user.scores.filter((s: UserScore) => s.points != NO_POINTS).length} / {euroInfo?.points.length}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex gap-3">
        <div className="col">
          <button
            disabled={refreshed}
            className="btn btn-primary"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-danger"
            onDoubleClick={() => setHarakiriModal(true)}
          >
            Harakiri (double click)
          </button>
        </div>
      </div>
      {isLoading && <div className="alert alert-info">
        Loading...
      </div>}
      {refreshed && !isLoading && <div className="alert alert-success">
        Refreshed!!
      </div>}
    </div>
  </>;
};

export default AdminPage;
