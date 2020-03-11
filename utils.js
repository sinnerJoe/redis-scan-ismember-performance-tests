
const client = require('redis').createClient();
const SEARCHED_EE = 12833;

function randomLower(number) {
  return Math.trunc((Math.random() - 0.000001) * number);
}

function generateDates(amount) {
  const arr = new Array(amount);
  for (let i=0; i<amount; i++) {
    const day = randomLower(30) + 1;
    const month = randomLower(12) + 1;
    const year = 2020 - randomLower(3);
    const employeeId = i < 500 ? SEARCHED_EE : 1000 + randomLower(10000);
    arr[i] = `${employeeId}:${year}-${month}-${day}`;
  }
  return arr;
}

function createCalculationSet() {
  return new Promise(resolve => {
    client.del('test', () => {
      client.sadd('test', generateDates(10000), (err, reply) => {
        resolve(reply);
      });
    })
  })
}

createCalculationSet()

