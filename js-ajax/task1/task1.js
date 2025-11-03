const requestURL = 'https://reqres.in/api/users/1';

const getUserById = async () => {
  try {
    const response = await fetch(requestURL, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });
    const result = await response.json();
    console.log('result: ', result.data);
    return result;
  } catch (error) {
    console.log('Error fetching user:: ', error);
  }
};

getUserById();
