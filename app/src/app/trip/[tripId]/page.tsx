import { getTrip, getTripRoutes, Route } from '@/data/firestore';
import RouteList from '../components/RouteList';

export default async function Trip({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  const routes: Route[] = await getTripRoutes(tripId);

  const departingCities = [
    // Drivable
    'CVG',
    'CMH',
    'IND',
    'SDF',
    'ORD',
    'CLE',
    'DTW',
    // Direct flights
    'LAX',
    'SFO',
    'DFW',
    'IAH',
  ];

  const arrivingCities = ['SYD', 'MEL'];

  return (
    <div className='container mx-auto mt-4 '>
      <h1 className='text-3xl text-secondary mb-4'>{trip.name}</h1>

      <RouteList
        routes={routes}
        departingCities={departingCities}
        arrivingCities={arrivingCities}
      />
    </div>
  );
}
