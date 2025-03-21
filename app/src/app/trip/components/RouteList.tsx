'use client';

import { FareClass, Route } from '@/data/firestore';
import RouteCard from './RouteCard';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type RouteListProps = {
  routes: Route[];
};

function RouteList({ routes }: RouteListProps) {
  const [fareClass, setFareClass] = useState<FareClass>('economy');

  const sortedRoutes = routes.toSorted((a, b) => {
    const fareA = a[fareClass].cheapest.price;
    const fareB = b[fareClass].cheapest.price;
    return fareA - fareB;
  });

  return (
    <div>
      <div className='flex justify-start space-x-2 bg-gray-700 '>
        <Button
          variant={fareClass === 'economy' ? 'default' : 'outline'}
          onClick={() => setFareClass('economy')}
        >
          Economy
        </Button>
        <Button
          variant={fareClass === 'business' ? 'default' : 'outline'}
          onClick={() => setFareClass('business')}
        >
          Business
        </Button>
      </div>
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
