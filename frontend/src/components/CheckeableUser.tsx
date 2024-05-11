import User from "../models/User";

interface CheckableUserProps {
  user: User;
  isActiveUser: boolean;
  toogleUser: () => void;
  isEven: boolean;
};

const CheckableUser = ({user, isActiveUser, toogleUser, isEven}: CheckableUserProps) => {
  return (
    <div className="col-6">
      <div
        className={`card m-2 d-flex flex-row p-3 justify-content-between ${isEven ? "ms-0" : "me-0"}`}
        onClick={toogleUser}
      >
        <div>
          {user.name}
        </div>
        <div className="">
          <input type="checkbox"
            className="ms-2"
            readOnly
            checked={isActiveUser}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckableUser;
