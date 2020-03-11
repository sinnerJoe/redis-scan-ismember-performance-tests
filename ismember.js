
const redis = require('redis');

const client = redis.createClient();

const searchOne = (pattern) => new Promise(resolve => {
  client.sismember('test', pattern, (err, reply) => {
    resolve(reply == 1 ? pattern : null);
  });
})

const searchPatterns = (patterns) => {
  return Promise.all(patterns.map(searchOne)).then((patterns) => patterns.filter(p => p));
}



const SEARCHED_EE = 12833;

const monthlyDays = (year, month) => new Array(30).fill(0).map((v, i) => i + 1).map(day => `${SEARCHED_EE}:${year}-${month}-${day}`);

async function searchForAllMonths(repeats) {
  const months = new Array(12).fill(0).map((v, i) => i + 1)
  console.time('ISMEMBER')
  for (let i = 0; i < repeats; i++) {
    for (const month of months) {
      await searchPatterns(monthlyDays(2020, month))
    }
  }
  console.timeEnd('ISMEMBER');
}

searchForAllMonths(1);

