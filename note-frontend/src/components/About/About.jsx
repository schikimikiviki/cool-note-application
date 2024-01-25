import "./About.css";

const About = (props) => {
  const onClose = () => {
    props.onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          X
        </button>

        <h2 className="popup-title">About</h2>
      </div>
    </div>
  );
};

export default About;
