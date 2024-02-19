import "./LoginPage.css";
import noteIcon from "../../assets/note-icon.png";

const LoginPage = () => {
  const handleLogin = () => {
    // logic to handle user login
  };

  const handleRegister = () => {
    // logic for registration
    // generate username and password
    // save into db
  };

  return (
    <>
      <div className="login-container">
        <div className="login-header">
          <img src={noteIcon} alt="note-logo" width={150} height={150} />
          <h1>! my very important notes !</h1>
        </div>
        <div className="login-body">
          <h2>Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <input type="text" placeholder="Your name" />
            <input type="text" placeholder="Your password" />
            <br />
            <button type="submit">Login</button>
            ---------------OR---------------
            <button onClick={handleRegister}>Register</button>
            <br />
            No data is collected for registration.
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
