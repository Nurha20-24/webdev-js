const requestURL = 'https://reqres.in/api/unknown/23';

const getErrorDemo = async () => {
  try {
    const response = await fetch(requestURL, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });

    if (!response.ok) {
      throw new Error('Response not ok, status: ' + response.status);
    }

    const result = await response.json();
    console.log('result: ', result.data);
    return result.data;
  } catch (error) {
    console.log('Error occurred: ', error);
  }
};

getErrorDemo();
