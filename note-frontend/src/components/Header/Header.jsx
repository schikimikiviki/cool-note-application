import PlusButton from "../PlusButton/PlusButton";
import ModeSwitcher from "../ModeSwitcher/ModeSwitcher";
import "./Header.css";

const Header = (props) => {
  const handleData = () => {
    props.onReceive();
  };

  const handleSwitch = () => {
    props.onClick();
  };

  return (
    <div className="margin-decent header-main">
      <div className="header-item">
        <img src="/note-icon.png" alt="note-logo" width={150} height={150} />
        <h1 className="heading-main">! my very important notes !</h1>
      </div>
      <div className="header-item">
        <ModeSwitcher onSwitch={handleSwitch} />
        <PlusButton onClick={handleData} />
      </div>
    </div>
  );
};

export default Header;
