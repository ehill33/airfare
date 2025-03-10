import { chromium, expect } from '@playwright/test';

export async function scrapeFlights({
  cabinClass,
  fromAirport,
  toAirport,
  startDate,
  endDate,
}) {
  const topFlights = [];

  try {
    const browser = await chromium.launch({
      headless: false,
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    await page.goto('https://www.google.com/flights');
    if (cabinClass === 'Business') {
      await page
        .getByRole('combobox', { name: 'Change seating class' })
        .click();

      await wait(500);
      await page.getByRole('option', { name: cabinClass, exact: true }).click();
    }
    await page.getByLabel('Where from?').fill(fromAirport);
    await page.locator(`li[data-code="${fromAirport}"]`).first().click();
    await page.getByLabel('Where to?').fill(toAirport);
    // await page.getByRole('option', { name: new RegExp(toAirport) }).click();
    await page.locator(`li[data-code="${toAirport}"]`).first().click();
    await page
      .getByRole('textbox', { name: 'Departure' })
      // .fill(formatDate(startDate));
      .fill(startDate);
    await page.keyboard.press('Enter');
    await wait(500);
    await page
      .getByRole('textbox', { name: 'Return' })
      // .fill(formatDate(endDate));
      .fill(endDate);
    await page.keyboard.press('Enter');
    await wait(500);
    await page.getByRole('button', { name: 'Search' }).click();

    // const departingFlightsHeader = page
    //   .getByRole('heading', {
    //     name: 'Top departing flights',
    //   })
    //   .or(page.getByRole('heading', { name: 'Departing flights' }));
    // await expect(departingFlightsHeader).toBeVisible({ timeout: 15000 });
    // await expect(
    //   page.getByRole('heading', {
    //     name: /departing flights/i,
    //   })
    // ).toBeVisible({ timeout: 15000 });

    await new Promise((resolve) => setTimeout(resolve, 20000));
    await expect(page.getByRole('tabpanel').first()).toBeVisible({
      timeout: 15000,
    });

    const items = await page
      .getByRole('list')
      .first()
      .getByRole('listitem')
      .all();

    let price, duration, stops;

    for (const item of items) {
      // Check if the item contains the text '$'
      if ((await item.getByText('$').count()) === 0) {
        console.log('No price found. Skipping...');
        continue;
      }

      const farePrice = await item.getByText('$').first().textContent();
      const fareDuration = await item.getByText('hr').first().textContent();
      const fareStops = await item.getByText('stop').first().textContent();

      // convert price string with dollar sign and commas to number
      if (farePrice) {
        price = priceToNumber(farePrice);
      }

      // convert duration string to number of minutes. ex: 23 hr 10 min = 1380
      if (fareDuration) {
        duration = durationToMinutes(fareDuration);
      }

      if (fareStops) {
        stops = stopsToNumber(fareStops);
      }

      topFlights.push({
        price,
        duration,
        stops,
      });
    }

    // for (const price of prices) {
    //   const pText = await price.textContent();
    //   console.log(pText);
    // }

    console.log(`Top ${cabinClass} flights for ${fromAirport} to ${toAirport}`);
    console.log(topFlights);
    console.log('\n\n');

    await browser.close();
  } catch (error) {
    console.error(`Error scraping ${fromAirport} to ${toAirport}: ${error}`);
    console.error(error);
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function priceToNumber(price) {
  return Number(price.replace('$', '').replace(',', ''));
}

function durationToMinutes(duration) {
  // Split the duration string by spaces
  let parts = duration.split(' ');

  // Initialize minutes to 0
  let minutes = 0;

  // Loop through the parts of the duration
  for (let i = 0; i < parts.length; i += 2) {
    // Convert current part to number
    let value = parseInt(parts[i]);

    // Check if the unit is hours or minutes and convert accordingly
    if (parts[i + 1].startsWith('hr')) {
      minutes += value * 60; // Convert hours to minutes
    } else if (parts[i + 1].startsWith('min')) {
      minutes += value;
    }
  }

  return minutes;
}

function stopsToNumber(stops) {
  return Number(stops[0]);
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
