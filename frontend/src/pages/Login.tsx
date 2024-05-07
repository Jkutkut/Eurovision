import { useState } from "react";

interface Props {
  login: (name: string) => void
}

const Login = ({ login }: Props) => {
  const [name, setName] = useState('');
  
  return (
    <>
      <div className="form-group" style={{padding: "20px"}}>
        <h3>Benimpiadas <span className="badge bg-secondary">Eurovision edition</span></h3>
        <div className="form-group">
          <label htmlFor="nickname">Name</label>
          <input type="text" className="form-control"
            id="nickname" aria-describedby="nicknameHelp" onChange={(e) => setName(e.target.value)}/>
        </div>
        <br />
        <button onClick={() => login(name)} className="btn btn-dark w-100">Login</button>
      </div>
    </>
  );
}

export default Login
