import PlusButton from "./PlusButton";

const Header = (props) => {
  const handleData = () => {
    props.onReceive();
  };

  return (
    <div className="margin-decent header-main">
      <img src="/note-icon.png" alt="note-logo" width={150} height={150} />
      <h1>! my very important notes !</h1>
      <PlusButton onClick={handleData} />
    </div>
  );
};

export default Header;
