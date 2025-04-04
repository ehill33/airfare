'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Fare, FareClass, Route } from '@/data/firestore';
import {
  formatDateShort,
  formatDateLong,
  formatPrice,
  formatDuration,
} from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type RouteCardProps = {
  fareClass: FareClass;
  route: Route;
};

export default function RouteCard({ fareClass, route }: RouteCardProps) {
  const {
    fromAirport,
    toAirport,
    startDate,
    endDate,
    business,
    economy,
    updatedAt,
  } = route;

  const tripId = useParams().tripId;

  const routeTitle = `${fromAirport} → ${toAirport}`;
  const formattedStartDate = formatDateShort(startDate);
  const formattedEndDate = formatDateShort(endDate);

  // Determine which fare class to display (economy or business)
  const fares = fareClass === 'economy' ? economy : business;

  return (
    <Link href={`/trip/${tripId}/route/${route.id}`}>
      <Card className='@container'>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>{routeTitle}</CardTitle>
            <Badge className='capitalize'>{fareClass}</Badge>
          </div>
          <CardDescription>
            {formattedStartDate} - {formattedEndDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {fares && (
              <div className='grid grid-cols-1 gap-3 @xs:grid-cols-3'>
                <FarePrice fareType='cheapest' fare={fares.cheapest} />
                <FarePrice fareType='best' fare={fares.best} />
                <FarePrice fareType='quickest' fare={fares.quickest} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className='text-sm text-muted-foreground'>
          {`Last updated: ${formatDateLong(updatedAt)}`}
        </CardFooter>
      </Card>
    </Link>
  );
}

export function FarePrice({
  fareType,
  fare,
}: {
  fareType: string;
  fare: Fare | number;
}) {
  const farePrice = typeof fare === 'number' ? fare : fare.price;
  const fareDuration = typeof fare === 'number' ? undefined : fare.duration;

  return (
    <div className='p-4 border rounded-lg'>
      <div className='font-medium text-sm text-muted-foreground mb-1 capitalize'>
        {fareType}
      </div>
      <div className='font-bold text-lg text-foreground'>
        {formatPrice(farePrice)}
      </div>
      {fareDuration && (
        <div className='text-sm text-muted-foreground'>
          {formatDuration(fareDuration)}
        </div>
      )}
    </div>
  );
}
