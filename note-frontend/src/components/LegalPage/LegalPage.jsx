import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LegalPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='settings-background'>
        <div className='settings-box'>
          <br />
          <br />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              className='exit'
              type='submit'
              onClick={() => {
                navigate('/');
              }}
            >
              ⬅️ Back to home page
            </button>
          </div>
          <br />
          <br />
          <h1>Legal notice</h1>
          <br />
          <br />
          <Tabs defaultTab='vertical-tab-one' vertical>
            <TabList>
              <Tab tabFor='vertical-tab-one'>Legal info</Tab>
              <Tab tabFor='extra'>Data protection and privacy</Tab>
            </TabList>
            <TabPanel tabId='vertical-tab-one'>
              <h2>
                <u>Purpose of this website</u>
              </h2>
              <p style={{ fontSize: '24px', marginTop: '15px' }}>
                This website is part of a developer portfolio that can be found
                here: <a href='https://vbdev.at/'>https://vbdev.at/</a>. It has
                no other purpose than showing the skills I aquired during the
                last months of programming.
              </p>
              <br></br>
              <h2>
                <u>Contact</u>
              </h2>
              <p style={{ fontSize: '24px', marginTop: '15px' }}>
                You can contact me at:{' '}
                <a href='mailto:admin@blitznotiz.at'>admin@blitznotiz.at</a>
              </p>
            </TabPanel>

            <TabPanel tabId='extra'>
              <h2>
                <u>What data is collected?</u>
              </h2>
              <p style={{ fontSize: '24px', marginTop: '15px' }}>
                Only the data you enter in the registration field + in the
                settings is saved. This is: your username, your password, your
                name, your preferred color palette (if selected), your mail
                adress (if 2fa is activated), your custom filters (if used),
                your theme preference and your preferences regarding note titles
                and "done" notes.
              </p>

              <br></br>
              <h2>
                <u>What happens to the data?</u>
              </h2>
              <p style={{ fontSize: '24px', marginTop: '15px' }}>
                Data is safely stored in a database and is not used for any
                other purposes than those regarding the notes app: Users can
                save notes, edit notes and export them to Google Calender (if a
                note has a valid date). Your mail adress is only used for 2fa,
                if activated, and you will not receive any other (spam) mails.
                Your data is not given to any third parties.
              </p>
              <br></br>
              <h2>
                <u>How can I delete my account?</u>
              </h2>
              <p style={{ fontSize: '24px', marginTop: '15px' }}>
                You can delete your account (and therefore the database entry)
                at any time at Settings > Advanced.
              </p>
              <br />
              <br />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
