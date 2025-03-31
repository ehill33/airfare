'use server';

import { Trip } from '@/data/firestore';
import { updateTrip } from '@/data/firestore';

export async function saveTrip(trip: Trip) {
  await updateTrip(trip);
}
