import { getTripRoutes, getTrips } from '@/data/firestore';
import Link from 'next/link';

export default async function Home() {
  const trips = await getTrips();
  // const routes = await getTripRoutes('RGh7kNPGhm7XHeZbJGuD');

  return (
    <div className='container mx-auto mt-4'>
      <h1 className='text-5xl'>Trips</h1>
      <ul className='py-4 max-w-xl'>
        {trips &&
          trips.map((trip) => (
            <li key={trip.id} className='p-4 rounded-md bg-gray-700'>
              <Link href={`/trip/${trip.id}`}>{trip.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
