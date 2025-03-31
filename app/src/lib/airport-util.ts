import { airports } from '@nwpr/airport-codes';

type LibraryAirport = {
  id: number;
  name?: string;
  city?: string;
  country?: string;
  iata?: string;
  icao?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  timezone?: number;
  dst?: string;
  tz?: string;
  type?: string;
  source?: string;
};

// New type that guarantees the iata property is defined
export type Airport = LibraryAirport & {
  iata: string; // Make iata required
};

// Helper function to filter airports with iata code
function hasIata(airport: LibraryAirport): airport is Airport {
  return !!airport.iata;
}

export function getAirportByCode(code: string): Airport | undefined {
  const airport = airports.find((airport) => airport.iata === code);
  return airport && hasIata(airport) ? airport : undefined;
}

export function getAirportByCity(city: string): Airport | undefined {
  const airport = airports.find((airport) => airport.city === city);
  return airport && hasIata(airport) ? airport : undefined;
}

export function getAirportByCountry(country: string): Airport | undefined {
  const airport = airports.find((airport) => airport.country === country);
  return airport && hasIata(airport) ? airport : undefined;
}

export function searchAirport(value: string): Airport[] {
  if (!value) return [];

  const query = value.toLowerCase().trim();

  const matches = airports.filter((airport) => {
    if (!hasIata(airport)) return false;

    const iataMatch = airport.iata.toLowerCase().includes(query);
    const nameMatch = airport.name?.toLowerCase().startsWith(query);
    const cityMatch = airport.city?.toLowerCase().startsWith(query);
    const countryMatch = airport.country?.toLowerCase().startsWith(query);

    return iataMatch || nameMatch || cityMatch || countryMatch;
  }) as Airport[];

  // Check for exact IATA match and move it to the beginning of the array
  const exactIataMatchIndex = matches.findIndex(
    (airport) => airport.iata.toLowerCase() === query
  );

  // If an exact match exists, move it to the front of the array
  if (exactIataMatchIndex > 0) {
    const exactMatch = matches.splice(exactIataMatchIndex, 1)[0];
    matches.unshift(exactMatch);
  }

  return matches;
}
