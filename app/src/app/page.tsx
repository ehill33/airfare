import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrips } from '@/data/firestore';
import Link from 'next/link';
import Header from '@/components/Header';

export default async function Home() {
  const trips = await getTrips();

  return (
    <div className='container mx-auto'>
      <Header title='Trips' />
      <ul className='max-w-xl'>
        {trips &&
          trips.map((trip) => (
            <li key={trip.id}>
              <Link href={`/trip/${trip.id}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{trip.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
