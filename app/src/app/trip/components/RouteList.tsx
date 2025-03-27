'use client';

import { Route } from '@/data/firestore';
import RouteCard from './RouteCard';
import RouteFilters from './RouteFilters';
import useFilterRoutes from '@/hooks/useFilterRoutes';

type RouteListProps = {
  routes: Route[];
  departingCities: string[];
  arrivingCities: string[];
};

function RouteList({
  routes,
  departingCities,
  arrivingCities,
}: RouteListProps) {
  const {
    fareClass,
    filteredRoutes,
    filterState,
    setFilterState,
    applyFilters,
  } = useFilterRoutes({
    routes,
    departingCities,
    arrivingCities,
  });

  const sortedRoutes = filteredRoutes.toSorted((a, b) => {
    const fareA = a[fareClass].cheapest.price;
    const fareB = b[fareClass].cheapest.price;
    return fareA - fareB;
  });

  return (
    <div>
      <RouteFilters
        departingCities={departingCities}
        arrivingCities={arrivingCities}
        filterState={filterState}
        setFilterState={setFilterState}
        applyFilters={applyFilters}
      />
      <ul
        className='grid gap-4'
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(375px, 1fr))' }}
      >
        {sortedRoutes.map((route: Route) => (
          <li key={route.id} className='bg-gray-700 my-1'>
            <RouteCard fareClass={fareClass} route={route} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default RouteList;
