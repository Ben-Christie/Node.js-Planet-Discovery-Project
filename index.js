/*
  Streaming Large Data Files

  The csv-parse package implements the stream API for large data files, this is the recommended approach for maximum power and ensures scalability of much larger data sets, read data line by line as its read from our hard drive

  In Node all stream are implemented using the event emitter, where the events are emitted by node and we just react to the event on that stream using the on function
*/

// destructuring, name = parse
const { parse } = require('csv-parse');
const fileSystem = require('fs'); // fileSystem (or fs) is the default Node file reader

// for each chuck of data we receive, lets create an array called results and make it a const so we can't reassign the results but we can update the contents by pushing values
const habitablePlanets = [];

// create a function that filters out only those planets which are confirmed to be habitable
// insolation flux (koi_insol) or Stellar flux refers to the amount of light a planet gets
// the planet must not be more than 1.6 times the size of earth as well (koi_prad)
function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

// create a read stream using our csv file, this will give us an event emiiter that we can react to event with our on function
// read stream just reads the raw data in bits and bytes
fileSystem
  .createReadStream('kepler_data.csv')
  // parse the results so we can understand the data we're receiving
  // the pipe function is meant to connect a readbale stream source to a writable stream desination
  // kepler file is our source and the parse function is our destination
  .pipe(
    // here we're saying that comments in our file begin with a #
    // we set columns to true so that we return each row as a javascript object with key/value pairs
    parse({
      comment: '#',
      columns: true,
    })
  )
  .on('data', (data) => {
    // push each data chunk on to the array, only push if the planet is habitable
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    // error handling
    console.log('Error:', err);
  })
  .on('end', () => {
    console.log(
      'Habitable Planets:',
      habitablePlanets.map((planet) => {
        return planet['kepler_name'];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });

// parse the results so we can understand the data we're receiving
// the pipe function is meant to connect a readbale stream source to a writable stream desination
// kepler file is our source and the parse function is our destination
