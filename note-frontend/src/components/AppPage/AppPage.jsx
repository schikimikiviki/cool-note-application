import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ios1 from '../../assets/ios-1.png';
import ios2 from '../../assets/ios-2.png';
import ios3 from '../../assets/ios-3.png';
import android1 from '../../assets/android-1.png';
import android2 from '../../assets/android-2.jpeg';

const AppPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  return (
    <div className='settings-background'>
      <div className='settings-box'>
        <br />
        <button className='exit' onClick={() => navigate('/')}>
          ⬅️ Back to home page
        </button>
        <br />
        <br />
        <h1>Download the app</h1>
        <br />
        <br />

        <div style={{}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginRight: '20px',
              paddingRight: isMobile ? '5vw' : '30vw',
              paddingLeft: isMobile ? '5vw' : '30vw',
            }}
          >
            <button
              style={{
                padding: '10px',
                marginBottom: '5px',
                fontSize: '25px',
                backgroundColor: activeTab === 0 ? '#2d8ec3' : '#ddd',
                color: activeTab === 0 ? 'white' : 'black',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleTabClick(0)}
            >
              IOS
            </button>
            <button
              style={{
                padding: '10px',
                fontSize: '25px',
                marginBottom: '5px',
                backgroundColor: activeTab === 1 ? '#2d8ec3' : '#ddd',
                color: activeTab === 1 ? 'white' : 'black',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleTabClick(1)}
            >
              Android
            </button>
          </div>

          <div style={{ padding: isMobile ? '0px' : '50px', flex: 1 }}>
            {activeTab === 0 && (
              <div
                style={{
                  display: isMobile ? 'inline' : 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <p style={{ fontSize: '22px', marginBottom: '10px' }}>
                    Click on the "share" icon.
                  </p>
                  <img src={ios1} width='280' height='600' />
                </div>
                <div>
                  <p style={{ fontSize: '22px', marginBottom: '10px' }}>
                    Click "add to homepage".
                  </p>
                  <img src={ios2} width='280' height='600' />
                </div>
                <div>
                  <p style={{ fontSize: '22px', marginBottom: '10px' }}>
                    Click "save" in the top right corner.
                  </p>
                  <img src={ios3} width='280' height='600' />
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div
                style={{
                  display: isMobile ? 'inline' : 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '22px',
                      marginBottom: '10px',
                      minHeight: '100px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                  >
                    Click on the settings icon <br></br>in the top right corner
                    <br></br>
                    and select "add to home page".
                  </p>
                  <img src={android1} width='280' height='600' />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '22px',
                      marginBottom: '10px',
                      minHeight: '100px',

                      justifyContent: 'center',
                      alignContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    Click "install".
                  </p>
                  <img src={android2} width='280' height='600' />
                </div>
              </div>
            )}
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default AppPage;
