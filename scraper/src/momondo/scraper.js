import { chromium, expect } from '@playwright/test';

export async function scrapeFlights({
  cabinClass,
  fromAirport,
  toAirport,
  startDate,
  endDate,
}) {
  const startTime = new Date();

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto(
      `https://www.momondo.com/flight-search/${fromAirport}-${toAirport}/${startDate}/${endDate}/${cabinClass}`
    );

    await expect(
      page.locator('#leftRail').getByText('Loading', { exact: true })
    ).not.toBeVisible({ timeout: 60000 });

    const cheapest = await page
      .getByRole('button', { name: 'Cheapest' })
      .locator('.Hv20-value')
      .textContent()
      .then(getFlightInfo);
    const best = await page
      .getByRole('button', { name: 'Best' })
      .locator('.Hv20-value')
      .textContent()
      .then(getFlightInfo);
    const quickest = await page
      .getByRole('button', { name: 'Quickest' })
      .locator('.Hv20-value')
      .textContent()
      .then(getFlightInfo);
    console.log(
      `Flights from ${fromAirport} to ${toAirport} in ${cabinClass}:`
    );
    console.log(`Processed in ${new Date() - startTime}ms`);
    console.dir({
      cheapest,
      best,
      quickest,
    });
    console.log('\n\n');

    await browser.close();

    return {
      cheapest,
      best,
      quickest,
      fromAirport,
      toAirport,
      cabinClass,
      startDate,
      endDate,
    };
  } catch (error) {
    await page.screenshot({
      path: `screenshots/${fromAirport}-${toAirport}-${cabinClass}.png`,
    });
    await browser.close();
    throw error;
  }
}

function getFlightInfo(priceAndDuration) {
  const [price, duration] = priceAndDuration.split(' • ');
  return { price: priceToNumber(price), duration: durationToMinutes(duration) };
}

function priceToNumber(price) {
  return Number(price.replace('$', '').replace(',', ''));
}

function durationToMinutes(duration) {
  const parts = duration.split(' ');
  let totalMinutes = 0;

  for (const part of parts) {
    if (part.endsWith('h')) {
      totalMinutes += parseInt(part) * 60;
    } else if (part.endsWith('m')) {
      totalMinutes += parseInt(part);
    }
  }

  return totalMinutes;
}
