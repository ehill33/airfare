import { Fare, Fares } from '@/data/firestore';

type Props = {
  cabin: string;
  fares: Fares;
};

export default function FareQuotes({ cabin, fares }: Props) {
  return (
    <div className='mt-2 w-full'>
      <div className='text-lg font-bold'>{cabin}</div>
      <div className='flex flex-col gap-2 mt-1'>
        <FarePrice fare={fares.cheapest} type='cheapest' />
        <FarePrice fare={fares.best} type='best' />
        <FarePrice fare={fares.quickest} type='quickest' />
      </div>
    </div>
  );
}

will not show up because you need to update the database with lowercase cabins

function FarePrice({
  fare,
  type,
}: {
  fare: Fare;
  type: 'cheapest' | 'best' | 'quickest';
}) {
  let color = '';
  if (type === 'cheapest') {
    color = 'bg-green-600';
  } else if (type === 'best') {
    color = 'bg-blue-600';
  } else if (type === 'quickest') {
    color = 'bg-red-600';
  }

  return (
    <div className='flex gap-2'>
      <div>
        <div>${fare.price}</div>
      </div>
      <div>{minutesToDuration(fare.duration)}</div>
      <span className={`text-sm ${color} py-1 px-2 rounded-lg ml-auto`}>
        {type}
      </span>
    </div>
  );
}

function minutesToDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
