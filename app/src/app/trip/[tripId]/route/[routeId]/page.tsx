import { FarePrice } from '@/app/trip/components/RouteCard';
import { getRouteHistory, getRoute, Fares } from '@/data/firestore';
import PriceChart from './components/PriceChart';
import { Button } from '@/components/ui/button';

export default async function RoutePage({
  params,
}: {
  params: { tripId: string; routeId: string };
}) {
  const { tripId, routeId } = await params;
  const route = await getRoute(tripId, routeId);
  const economyRouteHistory = await getRouteHistory(tripId, routeId, 'economy');
  const businessRouteHistory = await getRouteHistory(
    tripId,
    routeId,
    'business'
  );

  const routeTitle = `${route.fromAirport} → ${route.toAirport}`;

  const cheapestEconomyFare = getCheapestFare(economyRouteHistory);
  const cheapestBusinessFare = getCheapestFare(businessRouteHistory);
  const averageEconomyFare = getAverageFare(economyRouteHistory);
  const averageBusinessFare = getAverageFare(businessRouteHistory);
  const highestEconomyFare = getHighestFare(economyRouteHistory);
  const highestBusinessFare = getHighestFare(businessRouteHistory);

  return (
    <div className='container mx-auto mt-4 '>
      <div className='flex flex-row justify-between mb-4'>
        <h1 className='text-3xl text-secondary mb-4'>{routeTitle}</h1>
        <a
          href={`https://www.momondo.com/flight-search/${route.fromAirport}-${route.toAirport}/${route.startDate}/${route.endDate}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button variant='outline' className='cursor-pointer'>
            View latest prices
          </Button>
        </a>
      </div>
      <RouteHistorySummary
        title='Economy'
        cheapestFare={cheapestEconomyFare}
        highestFare={highestEconomyFare}
        averageFare={averageEconomyFare}
      />
      <PriceChart fares={economyRouteHistory} />
      <RouteHistorySummary
        title='Business'
        cheapestFare={cheapestBusinessFare}
        highestFare={highestBusinessFare}
        averageFare={averageBusinessFare}
      />
      <PriceChart fares={businessRouteHistory} />
    </div>
  );
}

function RouteHistorySummary({
  title,
  cheapestFare,
  highestFare,
  averageFare,
}: {
  title: string;
  cheapestFare: Fares;
  highestFare: Fares;
  averageFare: number;
}) {
  return (
    <div>
      <h2 className='text-xl text-secondary mb-4'>{title}</h2>
      <div className='grid grid-cols-3 gap-4 mb-4'>
        <FarePrice fareType='cheapest' fare={cheapestFare.cheapest} />
        <FarePrice fareType='highest' fare={highestFare.cheapest} />
        <FarePrice fareType='average' fare={averageFare} />
      </div>
    </div>
  );
}

function getCheapestFare(fares: Fares[]) {
  return fares.reduce((acc, fare) =>
    acc.cheapest.price < fare.cheapest.price ? acc : fare
  );
}

function getHighestFare(fares: Fares[]) {
  return fares.reduce((acc, fare) =>
    acc.cheapest.price > fare.cheapest.price ? acc : fare
  );
}

function getAverageFare(fares: Fares[]) {
  return (
    fares.reduce((acc, fare) => acc + fare.cheapest.price, 0) / fares.length
  );
}
