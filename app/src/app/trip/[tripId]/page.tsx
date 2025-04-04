import { getTrip, getTripRoutes, Route } from '@/data/firestore';
import RouteList from '../components/RouteList';
import Header from '@/components/Header';

export default async function Trip({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  const routes: Route[] = await getTripRoutes(tripId);

  return (
    <div className='container mx-auto'>
      <Header title={trip.name} showBackButton />
      <RouteList routes={routes} trip={trip} />
    </div>
  );
}
