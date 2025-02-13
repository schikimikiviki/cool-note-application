import './About.css';
import picture from '../../assets/about.jpg';

const About = ({ fontSize, isMobile }) => {
  return (
    <div>
      <div>
        <h2 className='popup-title' style={{ fontSize: fontSize }}>
          About
        </h2>
        <div className={isMobile ? 'about-mobile' : 'about-container'}>
          <div>
            <img src={picture} width='220' height='280' />
          </div>
          <div
            className='container-text'
            style={{ fontSize: fontSize, marginTop: isMobile ? '20px' : '0px' }}
          >
            Hi! My name is Viktoria and this is my Notes Application, where
            simplicity meets productivity. Organize your thoughts effortlessly
            with my user-friendly interface. Customize your notes with different
            colors for easy categorization. Start your journey today and
            organize your life.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
