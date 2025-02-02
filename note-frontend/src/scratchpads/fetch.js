try {
  const res = await fetch(`http://localhost:8088/api/colorpalettes/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();

  console.log('DATA: ', data);
} catch (error) {
  console.error(`Error during fetch type:  ${error}`);
}
