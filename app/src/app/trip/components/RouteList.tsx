'use client';

import { Route } from '@/data/firestore';
import RouteCard from './RouteCard';
import RouteFilters from './RouteFilters';
import useFilterRoutes from '@/hooks/useFilterRoutes';
import AirportManagement from './AirportManagement';
import { Trip } from '@/data/firestore';

type RouteListProps = {
  routes: Route[];
  trip: Trip;
};

function RouteList({ routes, trip }: RouteListProps) {
  const {
    fareClass,
    filteredRoutes,
    filterState,
    setFilterState,
    applyFilters,
  } = useFilterRoutes({
    routes,
    trip,
  });

  const sortedRoutes = filteredRoutes.toSorted((a, b) => {
    const fareA = a[fareClass].cheapest.price;
    const fareB = b[fareClass].cheapest.price;
    return fareA - fareB;
  });

  return (
    <div>
      <div className='flex justify-between sm:justify-start gap-4 my-4'>
        <AirportManagement trip={trip} />
        <RouteFilters
          trip={trip}
          filterState={filterState}
          setFilterState={setFilterState}
          applyFilters={applyFilters}
        />
      </div>
      <ul className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] overflow-x-scroll'>
        {sortedRoutes.map((route: Route) => (
          <li key={route.id}>
            <RouteCard fareClass={fareClass} route={route} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default RouteList;
