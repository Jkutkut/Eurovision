import UserScore from './UserScore';

interface User {
  id: number,
  name: string
  scores: UserScore[]
};

export default User;
