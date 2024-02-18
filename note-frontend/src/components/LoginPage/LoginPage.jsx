import "./LoginPage.css";
import noteIcon from "../../assets/note-icon.png";

const LoginPage = () => {
  return (
    <>
      <div className="header-item">
        <img src={noteIcon} alt="note-logo" width={150} height={150} />
        <h1 className="heading-main">! my very important notes !</h1>
      </div>
    </>
  );
};

export default LoginPage;
