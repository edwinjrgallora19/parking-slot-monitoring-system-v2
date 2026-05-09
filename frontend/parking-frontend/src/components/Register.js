function Register({
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    register,
    setIsRegistering
}) {

    return (
        <div style={{ padding: "20px" }}>

            <h1>Register</h1>

            <input
                placeholder="Name"
                onChange={e => setName(e.target.value)}
                value={name}
            />

            <br /><br />

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

            <button onClick={register}>
                Register
            </button>

            <br /><br />

            <button onClick={() => setIsRegistering(false)}>
                Already have an account? Login
            </button>

        </div>
    );
}

export default Register;