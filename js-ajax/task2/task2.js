const requestURL = 'https://reqres.in/api/users';

const postUser = async () => {
  try {
    const response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'x-api-key': 'reqres-free-v1',
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const result = await response.json();
    console.log('result: ', result);
    return result;
  } catch (error) {
    console.log('Error posting user: ', error);
  }
};

const user = {
  name: 'akuankka',
  job: 'Developer',
};

postUser();
