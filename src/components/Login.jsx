function Login() {
  return (
    <main>
      <form>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default Login;
