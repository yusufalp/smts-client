function Signup() {
  return (
    <div>
      <h1>Create an account</h1>
      <form>
        <label htmlFor="first">First name</label>
        <input type="text" name="first" id="first" />
        <label htmlFor="last">Last name</label>
        <input type="text" name="last" id="last" />
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default Signup;
