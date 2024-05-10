interface UserScore {
  song_id: number;
  points: number;
  nickname: string;
  notes: string;
};

const NO_POINTS = -1;

export default UserScore;
export {NO_POINTS};
