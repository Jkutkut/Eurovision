import { useState } from 'react'
import Login from './pages/Login';

function App() {

  let login = localStorage.getItem('login');
  
  if (login == null) {
    return (
      <Login />
    );
  }

  return (
    <>
      <h1>Hello world</h1>
    </>
  )
}

export default App
