import { getTripRoutes } from '@/data/firestore';
import { airports } from '@nwpr/airport-codes';
import FareQuotes from '../components/Fares';

export default async function Trip({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  const routes = await getTripRoutes(tripId);

  return (
    <div className='container mx-auto mt-4'>
      <h1 className='text-5xl'>Trip Name</h1>
      <div>
        <h2 className='text-3xl'>Routes</h2>
        <ul className='py-4 max-w-xl'>
          {routes &&
            routes.map((route) => {
              const destinationAirport = getAirportByCode(route.toAirport);
              const destinationLocation = `${destinationAirport?.city}, ${destinationAirport?.country}`;

              return (
                <li key={route.id} className='p-4 bg-gray-700 my-1'>
                  <div className='flex justify-between'>
                    <div className='text-xl'>
                      {route.fromAirport} - {route.toAirport}
                    </div>

                    <div>
                      {route.startDate} - {route.endDate}
                    </div>
                  </div>
                  <div>{destinationLocation}</div>

                  <FareQuotes cabin='economy' fares={route.economy} />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

function getAirportByCode(code: string) {
  return airports.find((airport) => airport.iata === code);
}
