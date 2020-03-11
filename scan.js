
const redis = require('redis');

const client = redis.createClient();

const searchPatterns = (pattern) => {
  return scanCacheKey('0', pattern, []);
}

const scanCacheKey = (cursor, pattern, collection) => new Promise((resolve, reject) => {

    client.sscan('test', cursor, 'MATCH', pattern, (err, response) => {
      if (err) {
        reject(err);
      }
      cursor = response[0];
      const keys = response[1];
      keys.forEach((key) => {
        collection.push(key);
      });
      if (cursor === '0') {
        resolve(collection);
        return;
      }
      resolve(scanCacheKey(cursor, pattern, collection));
    });

});

const SEARCHED_EE = 12833;
async function searchForAllMonths(repeats) {
  const patterns = new Array(12).fill(0).map((v, i) => i + 1).map(v => `${SEARCHED_EE}:${2020}-${v}-*`);
  console.time('SSCAN')
  for (let i = 0; i< repeats; i++) {
    for(const pattern of patterns){
      await searchPatterns(pattern)
    }
  }
  console.timeEnd('SSCAN');
}

searchForAllMonths(1);

