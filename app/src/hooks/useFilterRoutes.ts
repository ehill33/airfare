import { FareClass, Route, Trip } from '@/data/firestore';
import { useCallback, useState } from 'react';

export type AirportFilter = {
  airportIata: string;
  isSelected: boolean;
};

export type FilterState = {
  fareClass: FareClass;
  filteredDepartureAirports: AirportFilter[];
  filteredArrivalAirports: AirportFilter[];
};

type useFilterRoutesProps = {
  routes: Route[];
  trip: Trip;
};

export default function useFilterRoutes({
  routes,
  trip,
}: useFilterRoutesProps) {
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>(routes);
  const [fareClass, setFareClass] = useState<FareClass>('economy');

  const [filterState, setFilterState] = useState<FilterState>({
    fareClass,
    filteredDepartureAirports: trip.departureAirports.map((airport) => ({
      airportIata: airport.iata!,
      isSelected: true,
    })),
    filteredArrivalAirports: trip.arrivalAirports.map((airport) => ({
      airportIata: airport.iata!,
      isSelected: true,
    })),
  });

  const applyFilters = useCallback(() => {
    // Check if any airports are selected in each filter group
    const hasDepartureAirportSelected =
      filterState.filteredDepartureAirports.some(
        (airport) => airport.isSelected
      );
    const hasArrivalAirportSelected = filterState.filteredArrivalAirports.some(
      (airport) => airport.isSelected
    );

    const updatedRoutes = routes.filter((route) => {
      // Only apply departure filter if at least one departure airport is selected
      const isDepartureAirportSelected =
        !hasDepartureAirportSelected ||
        filterState.filteredDepartureAirports.some(
          (airport) =>
            airport.airportIata === route.fromAirport && airport.isSelected
        );

      // Only apply arrival filter if at least one arrival airport is selected
      const isArrivalAirportSelected =
        !hasArrivalAirportSelected ||
        filterState.filteredArrivalAirports.some(
          (airport) =>
            airport.airportIata === route.toAirport && airport.isSelected
        );

      // Route must satisfy both filter conditions
      return isDepartureAirportSelected && isArrivalAirportSelected;
    });

    setFilteredRoutes(updatedRoutes);
    setFareClass(filterState.fareClass);
  }, [filterState, routes]);

  return {
    fareClass,
    filterState,
    setFilterState,
    filteredRoutes,
    applyFilters,
  };
}
