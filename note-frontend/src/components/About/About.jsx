import "./About.css";
import picture from "../../assets/about.jpg";

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
        <div className="about-container">
          <div>
            <img src={picture} width="220" height="280" />
          </div>
          <div className="container-text">
            Hi! My name is Viktoria and this is my Notes Application, where
            simplicity meets productivity. Organize your thoughts effortlessly
            with my user-friendly interface. Customize your notes with different
            colors for easy categorization. Whether you're a student,
            professional, or creative mind, the Notes App adapts to your needs.
            Experience the joy of streamlined note-taking, and boost your
            productivity. Start your journey today and organize your life.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
