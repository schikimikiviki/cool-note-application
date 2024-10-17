const fetchGetFromBackend = async (path, errorType) => {
  try {
    const res = await fetch(`http://localhost:8080/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error(`Error during fetch type: ${errorType} - ${error}`);
    return null; // Explicitly return null if an error occurs
  }
};

export default fetchGetFromBackend;
