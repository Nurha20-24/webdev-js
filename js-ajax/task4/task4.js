const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Responese is not ok, status code: ' + response.status);
    }
    const result = await response.json();

    console.log('result: ', result);
    return result;
  } catch (error) {
    console.log('fetch error', error);
  }
};

const showFetchData = async () => {
  try {
    const user = {
      name: 'John Doe',
      job: 'Developer',
    };
    const url = 'https://reqres.in/api/users';
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    const userData = await fetchData(url, options);
    console.log(userData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
showFetchData();
