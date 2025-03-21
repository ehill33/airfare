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
import { Fare, FareClass, FareType, Route } from '@/data/firestore';
import { useState } from 'react';

type RouteCardProps = {
  fareClass: FareClass;
  route: Route;
};

function formatDateShort(dateString: string): string {
  if (!dateString) return '';

  // Split the date string and create a new date with the parts
  const [year, month, day] = dateString
    .split('-')
    .map((num) => parseInt(num, 10));

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDateLong(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleString();
}

// Format duration in minutes to hours and minutes
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Format price to currency
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function RouteCard({ fareClass, route }: RouteCardProps) {
  const {
    fromAirport,
    toAirport,
    startDate,
    endDate,
    business,
    economy,
    id,
    updatedAt,
  } = route;

  const routeTitle = `${fromAirport} → ${toAirport}`;
  const formattedStartDate = formatDateShort(startDate);
  const formattedEndDate = formatDateShort(endDate);

  // Determine which fare class to display (economy or business)
  const fares = fareClass === 'economy' ? economy : business;

  return (
    <Card>
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
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              {/* Cheapest Fare */}
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
  );
}

function FarePrice({ fareType, fare }: { fareType: FareType; fare: Fare }) {
  return (
    <div className='p-3 border rounded-lg'>
      <div className='font-medium text-sm text-muted-foreground mb-1 capitalize'>
        {fareType}
      </div>
      <div className='font-bold text-lg'>{formatPrice(fare.price)}</div>
      <div className='text-sm text-muted-foreground'>
        {formatDuration(fare.duration)}
      </div>
    </div>
  );
}
