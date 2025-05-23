const {test, expect} = require('@playwright/test');

var tokenReceived;

test('Consultando as reservas cadastradas', async ({request}) => {
  const response = await request.get('/booking/');
  
  console.log(await response.json());

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(200);
});

test('Consultando as reservas cadastradas com base em um id', async ({request}) => {
  const response = await request.get('/booking/254');

  // transforma a resposta em json
  const jsonBody = await response.json();
  console.log(jsonBody);

  // verifica se os dados da reserva estão corretos
  expect(jsonBody.firstname).toBe('Camille')
  expect(jsonBody.lastname).toBe('Passos')
  expect(jsonBody.totalprice).toBe(123)
  expect(jsonBody.depositpaid).toBeTruthy()
  expect(jsonBody.bookingdates.checkin).toBe('2024-02-02')
  expect(jsonBody.bookingdates.checkout).toBe('2024-09-09')
  expect(jsonBody.additionalneeds).toBe('Breakfast')

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Consultando as reservas cadastradas com base em um id e se os campos estão sendo apresentados', async ({request}) => {
  const response = await request.get('/booking/254');

  // transforma a resposta em json
  const jsonBody = await response.json();
  console.log(jsonBody);

  //verifica se os campos estão sendo apresentados.
  expect(jsonBody).toHaveProperty('firstname')
  expect(jsonBody).toHaveProperty('lastname')
  expect(jsonBody).toHaveProperty('totalprice')
  expect(jsonBody).toHaveProperty('depositpaid')
  expect(jsonBody).toHaveProperty('bookingdates')
  expect(jsonBody).toHaveProperty('additionalneeds')

  // verifica se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Cadastrando uma reserva', async ({ request }) => {
  const response = await request.post('/booking', {
    data: {
      "firstname": "Adriano",
      "lastname": "RP",
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2023-06-01",
        "checkout": "2023-06-30"
      },
      "additionalneeds": "Breakfast"
    }
  });
  console.log(await response.json());

  // Verifica se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json()

  expect(responseBody.booking).toHaveProperty("firstname", "Adriano")
  expect(responseBody.booking).toHaveProperty("lastname", "RP")
  expect(responseBody.booking).toHaveProperty("totalprice", 111)
  expect(responseBody.booking).toHaveProperty("depositpaid", true)
})

test('Gerando um token', async ({ request }) => {
  const response = await request.post('/auth', {
    data: {
      "username": "admin",
      "password": "password123"
    }
  })
    console.log(await response.json());

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    tokenReceived = responseBody.token;
    console.log("Seu token é: " + tokenReceived)
})

test('Gerando um token e atualizando parcialmente um dado', async ({ request }) => {
  const response = await request.post('/auth', {
    data: {
      "username": "admin",
      "password": "password123"
    }
  })
    console.log(await response.json());

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    tokenReceived = responseBody.token;
    console.log("Seu token é: " + tokenReceived)

    const partialUpdateRequest = await request.patch('/booking/1596', {
      headers: {
        'Content-Type': 'application/json',
        'Acccept': 'application/json',
        'Cookie': `token=${tokenReceived}`
      },
      data: {
        "firstname": "fulano",
        "lastname": "rodrigues de paula",
        "totalprice": 332,
        "depositpaid": false
      }
    });

    console.log(await partialUpdateRequest.json());
    expect(partialUpdateRequest.ok()).toBeTruthy();
    expect(partialUpdateRequest.status()).toBe(200);
    const partialUpdatedResponseBody = await partialUpdateRequest.json()
    expect(partialUpdatedResponseBody).toHaveProperty("firstname","fulano")
    expect(partialUpdatedResponseBody).toHaveProperty("lastname","rodrigues de paula")
    expect(partialUpdatedResponseBody).toHaveProperty("totalprice",332)
    expect(partialUpdatedResponseBody).toHaveProperty("depositpaid",false)
    

})