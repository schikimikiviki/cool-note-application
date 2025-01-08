import { gapi } from 'gapi-script';
import { useEffect } from 'react';

const GoogleCalender = ({ notes }) => {
  useEffect(() => {
    initClient();
  }, []);

  const addEventToCalendar = (note) => {
    const event = {
      summary: note.title,
      description: note.content,
      start: {
        dateTime: note.dueDate,
        timeZone: 'Europe/Vienna',
      },
      end: {
        dateTime: note.dueDate,
        timeZone: 'Europe/Vienna',
      },
    };

    console.log('Event to be created:', event);

    gapi.client.calendar.events
      .insert({
        calendarId: 'primary',
        resource: event,
      })
      .then((response) => {
        console.log('Event created: ', response);
      })
      .catch((error) => {
        console.error('Error creating event: ', error);
      });
  };

  const initClient = () => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: import.meta.env.VITE_GOOGLE_CALENDER_API,
          clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
          ],
          scope: 'https://www.googleapis.com/auth/calendar.events',
        })
        .then(() => {
          console.log('GAPI client initialized');
        })
        .catch((error) => {
          console.error('Error initializing GAPI client: ', error);
        });
    });
  };

  const signIn = () => {
    return gapi.auth2.getAuthInstance().signIn();
  };

  const isISOString = (val) => {
    const d = new Date(val);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
  };

  const exportNotes = () => {
    // filter out the notes that have a valid date
    const filteredNotes = notes.filter(
      (note) => note.dueDate && isISOString(note.dueDate)
    );

    console.log('NOTES that are exported: ', filteredNotes);

    if (filteredNotes.length > 0) {
      signIn()
        .then(() => {
          filteredNotes.forEach((note) => addEventToCalendar(note));
        })
        .catch((error) => {
          console.error('Error signing in: ', error);
        });
    } else {
      console.log('There are no valid notes to export');
    }
  };

  return (
    <>
      <button onClick={exportNotes}>Export to Google Calendar</button>
    </>
  );
};

export default GoogleCalender;
