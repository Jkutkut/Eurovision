import useForm from '../hooks/useForm';

import UserScore from '../models/UserScore';
import Song from '../models/Song';

import ConfirmModal from './ConfirmModal';

interface Props {
  song: Song;
  userScore: UserScore;
  saveCallback: (userScore: UserScore) => void;
  cancelCallback: () => void;
}

const EditSong = ({song: songObj, userScore, saveCallback, cancelCallback}: Props) => {
  const { artist, country, song } = songObj;
  const { nickname, notes, onChange } = useForm({
    nickname: userScore.nickname,
    notes: userScore.notes
  }) as any;

  console.debug("Edit song: " + country);

  const save = () => {
    saveCallback({
      ...userScore,
      nickname,
      notes
    });
  };
  return (
    <ConfirmModal
      title={country}
      cancelCallback={cancelCallback}
      confirmCallback={save}
    >
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
          name="nickname" aria-describedby="nicknameHelp"
          value={nickname} onChange={(e) => onChange(e)} />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea className="form-control" name="notes" rows={3}
          placeholder="Anything you want to remember about this song"
          value={notes} onChange={(e) => onChange(e)} />
      </div>
    </ConfirmModal>
  );
};

export default EditSong;
