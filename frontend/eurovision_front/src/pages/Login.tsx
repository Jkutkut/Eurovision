function Login() {
    const login = () => {
        const loginInput = document.getElementById('loginInput') as HTMLInputElement;
        localStorage.setItem('login', loginInput.value);
        window.location.reload();
    }

    return (
        <>
            <h1>Login</h1>
            <input id="loginInput" type="text" />
            <button onClick={login}>Login</button>
        </>
    )
}

export default Login