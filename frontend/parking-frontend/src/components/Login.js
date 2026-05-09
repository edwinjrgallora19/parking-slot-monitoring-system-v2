function Login({
    email,
    password,
    setEmail,
    setPassword,
    login,
    setIsRegistering
}) {

    return (
        <div style={{ padding: "20px" }}>

            <h1>Login</h1>

            <input
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                value={email}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                value={password}
            />

            <br /><br />

            <button onClick={login}>
                Login
            </button>

            <br /><br />

            <button onClick={() => setIsRegistering(true)}>
                Create Account
            </button>

        </div>
    );
}

export default Login;