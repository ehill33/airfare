// import { scrapeFlights } from './google-flights/scraper.js';
import {
  getAirfares,
  getLatestTripInfoForCabinClass,
  getTripRoutes,
} from './lib/firestore.js';
import { scrapeFlights } from './momondo/scraper.js';
import { addAirfares, getRouteHistory } from './lib/firestore.js';

console.time('main');

const departingCities = [
  // Drivable
  'CVG',
  'CMH',
  'IND',
  'SDF',
  'ORD',
  'CLE',
  'DTW',
  // Direct flights
  'LAX',
  'SFO',
  'DFW',
  'IAH',
];

const arrivingCities = ['SYD', 'MEL'];

const failedScrapes = [];

for (const departingCity of departingCities) {
  for (const arrivingCity of arrivingCities) {
    for (const cabinClass of ['business', 'economy']) {
      const scrapeConfig = {
        cabinClass,
        fromAirport: departingCity,
        toAirport: arrivingCity,
        startDate: '2025-12-27',
        endDate: '2026-01-11',
      };

      const airfares = await scrapeAirfares(scrapeConfig);

      if (!airfares) {
        failedScrapes.push(scrapeConfig);
        continue;
      }

      await saveAirfares(airfares);
    }
  }
}

if (failedScrapes.length > 0) {
  // Wait 2 minutes and try again
  console.log(
    `Waiting 2 minutes before retrying ${failedScrapes.length} failed scrapes`
  );
  await new Promise((resolve) => setTimeout(resolve, 60000 * 2));

  for (let i = 0; i < failedScrapes.length; i++) {
    const failedScrapeConfig = failedScrapes[i];
    const airfares = await scrapeAirfares(failedScrapeConfig);

    if (!!airfares) {
      failedScrapes.splice(i, 1);
      await saveAirfares(airfares);
    }
  }
}

if (failedScrapes.length > 0) {
  console.error(
    `Failed to scrape ${failedScrapes.length} routes after 2 tries`
  );
  for (const failedScrapeConfig of failedScrapes) {
    console.error(JSON.stringify(failedScrapeConfig, null, 2));
  }
  process.exit(1);
}

async function scrapeAirfares(scrapeConfig) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    return await scrapeFlights(scrapeConfig);
  } catch (error) {
    console.error(
      `Error encountered while scraping:\n${JSON.stringify(
        scrapeConfig,
        null,
        2
      )}\n`
    );
    console.error(error);
  }
}

async function saveAirfares(airfares) {
  try {
    await addAirfares('RGh7kNPGhm7XHeZbJGuD', airfares);
    console.log(
      `Saved ${airfares.fromAirport}-${airfares.toAirport} in ${airfares.cabinClass}`
    );
  } catch (error) {
    console.error(
      `Error encountered while saving:\n${JSON.stringify(airfares, null, 2)}\n`
    );
    console.error(error);
  }
}

console.timeEnd('main');
process.exit(0);
