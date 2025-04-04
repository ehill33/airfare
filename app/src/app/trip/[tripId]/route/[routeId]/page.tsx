import { FarePrice } from '@/app/trip/components/RouteCard';
import {
  getRouteHistory,
  getRoute,
  Fares,
  Route,
  FareClass,
} from '@/data/firestore';
import PriceChart from './components/PriceChart';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

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
      <Header title={routeTitle} showBackButton />
      <div className='flex flex-col gap-10'>
        <div>
          <RouteHistoryHeader title='economy' route={route} />
          <RouteHistorySummary
            cheapestFare={cheapestEconomyFare}
            highestFare={highestEconomyFare}
            averageFare={averageEconomyFare}
          />
          <PriceChart fares={economyRouteHistory} />
        </div>
        <div>
          <RouteHistoryHeader title='business' route={route} />
          <RouteHistorySummary
            cheapestFare={cheapestBusinessFare}
            highestFare={highestBusinessFare}
            averageFare={averageBusinessFare}
          />
          <PriceChart fares={businessRouteHistory} />
        </div>
      </div>
    </div>
  );
}

function RouteHistoryHeader({
  title,
  route,
}: {
  title: FareClass;
  route: Route;
}) {
  let link = `https://www.momondo.com/flight-search/${route.fromAirport}-${route.toAirport}/${route.startDate}/${route.endDate}`;

  if (title === 'business') {
    link += '/business';
  }

  return (
    <div className='flex flex-row justify-between items-center mb-4'>
      <h1 className='text-2xl capitalize text-foreground mb-4'>{title}</h1>
      <a href={link} target='_blank' rel='noopener noreferrer'>
        <Button variant='default' className='cursor-pointer'>
          View latest prices
        </Button>
      </a>
    </div>
  );
}

function RouteHistorySummary({
  cheapestFare,
  highestFare,
  averageFare,
}: {
  cheapestFare: Fares;
  highestFare: Fares;
  averageFare: number;
}) {
  return (
    <div>
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
