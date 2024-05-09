import { useEffect, useState } from "react";

interface Props {
  login: (name: string) => void
}

const Login = ({ login }: Props) => {
  const [name, setName] = useState('');
  const [ isValid, setIsValid ] = useState(true);
  
  useEffect(() => {
    const input = document.getElementById('nickname') as HTMLInputElement;
    input?.focus();
    input?.select();
  }, []);

  const onUserInput = (value: string) => {
    setName(value);
    setIsValid(value.trim().length > 0);
  }

  const loginUser = () => {
    login(name.trim());
  };

  return (
    <>
      <div className="form-group" style={{padding: "20px"}}>
        <h3>Eurovision <span className="badge bg-secondary">2024</span></h3>
        <div className="form-group">
          <label htmlFor="nickname">Name</label>
          <input type="text" className="form-control"
            id="nickname"
            aria-describedby="nicknameHelp"
            onChange={(e) => onUserInput(e.target.value)}
          />
          <small id="nicknameHelp" className={`form-text text-danger ${isValid && 'd-none'}`}>
            Please enter your name
          </small>
        </div>
        <br />
        <button
          disabled={!isValid}
          onClick={loginUser}
          className="btn btn-primary w-100"
        >
          Begin
        </button>
      </div>
    </>
  );
}

export default Login
