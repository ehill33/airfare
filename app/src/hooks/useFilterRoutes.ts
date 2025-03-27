import { FareClass, Route } from '@/data/firestore';
import { useCallback, useState } from 'react';

type FilterState = {
  fareClass: FareClass;
  filteredDepartingCities: { city: string; isSelected: boolean }[];
  filteredArrivingCities: { city: string; isSelected: boolean }[];
};

type useFilterRoutesProps = {
  routes: Route[];
  departingCities: string[];
  arrivingCities: string[];
};

export default function useFilterRoutes({
  routes,
  departingCities,
  arrivingCities,
}: useFilterRoutesProps) {
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>(routes);
  const [fareClass, setFareClass] = useState<FareClass>('economy');

  const [filterState, setFilterState] = useState<FilterState>({
    fareClass,
    filteredDepartingCities: departingCities.map((city) => ({
      city,
      isSelected: true,
    })),
    filteredArrivingCities: arrivingCities.map((city) => ({
      city,
      isSelected: true,
    })),
  });

  const applyFilters = useCallback(() => {
    // Check if any cities are selected in each filter group
    const hasDepartingCitySelected = filterState.filteredDepartingCities.some(
      (city) => city.isSelected
    );
    const hasArrivingCitySelected = filterState.filteredArrivingCities.some(
      (city) => city.isSelected
    );

    const updatedRoutes = routes.filter((route) => {
      // Only apply departure filter if at least one departure city is selected
      const isDepartingCitySelected =
        !hasDepartingCitySelected ||
        filterState.filteredDepartingCities.some(
          (city) => city.city === route.fromAirport && city.isSelected
        );

      // Only apply arrival filter if at least one arrival city is selected
      const isArrivingCitySelected =
        !hasArrivingCitySelected ||
        filterState.filteredArrivingCities.some(
          (city) => city.city === route.toAirport && city.isSelected
        );

      // Route must satisfy both filter conditions
      return isDepartingCitySelected && isArrivingCitySelected;
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
