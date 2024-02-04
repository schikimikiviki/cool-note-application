import "./LogoutButton.css";

const LogoutButton = () => {
  const handleLogout = () => {
    //logout user
  };
  return (
    <>
      <button className="button-hover" onClick={handleLogout}>
        Logout →
      </button>
    </>
  );
};

export default LogoutButton;
