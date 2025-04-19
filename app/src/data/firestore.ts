import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import { db } from './firebase';
import { Airport } from '@/lib/airport-util';
import { DeletedObjectJSON, UserJSON } from '@clerk/nextjs/server';
export type Trip = {
  id: string;
  name: string;
  departureAirports: Airport[];
  arrivalAirports: Airport[];
};

export type Route = {
  id: string;
  fromAirport: string;
  toAirport: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  economy: Fares;
  business: Fares;
};

export type Fares = {
  id: string;
  cheapest: Fare;
  best: Fare;
  quickest: Fare;
  createdAt: string;
};

export type FareClass = 'economy' | 'business';
export type FareType = keyof Fares;

export type Fare = {
  price: number;
  duration: number;
};

export type User = UserJSON & {
  primary_email_address: string,
}

export async function getTrips(): Promise<Trip[]> {
  try {
    const tripsSnapshot = await db.collection('trips').get();

    return tripsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Trip)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrip(tripId: string): Promise<Trip> {
  const tripSnapshot = await db.collection('trips').doc(tripId).get();
  return tripSnapshot.data() as Trip;
}

export async function getTripRoutes(tripId: string): Promise<Route[]> {
  try {
    const routesSnapshot = await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .orderBy('economy.cheapest.price', 'asc')
      .withConverter(routeConverter)
      .get();

    return routesSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateTrip(trip: Trip) {
  const tripSnapshot = await db.collection('trips').doc(trip.id).get();

  if (!tripSnapshot.exists) {
    throw new Error('Trip not found');
  }

  await db.collection('trips').doc(trip.id).set(trip, { merge: true });
}

export async function getRoute(
  tripId: string,
  routeId: string
): Promise<Route> {
  const routeSnapshot = await db
    .collection('trips')
    .doc(tripId)
    .collection('routes')
    .doc(routeId)
    .get();

  return routeSnapshot.data() as Route;
}

export async function getRouteHistory(
  tripId: string,
  routeId: string,
  cabinClass: FareClass
): Promise<Fares[]> {
  try {
    const routeHistorySnapshot = await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .doc(routeId)
      .collection(cabinClass)
      .withConverter(fareConverter)
      .get();

    return routeHistorySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createUser(clerkUser: UserJSON) {
  const user: User = {
    primary_email_address: clerkUser.email_addresses[0].email_address,
    ...clerkUser
  }
  try {
    await db.collection('users').doc(clerkUser.id).set(user);
  } catch (error) {
    console.error(error)
  }
}

export async function updateUser() {
  // TODO: Handle both updating in app or clerk dashboard?
}

export async function deleteUser(clerkUser: DeletedObjectJSON) {
  if (!clerkUser.id) {
    console.warn('No id found for deleted user:', clerkUser)
    return
  }

  console.log(`Deleting user: ${clerkUser.id}`)

  try {
    await db.collection('users').doc(clerkUser.id).delete();
  } catch(error) {
    console.error(error);
  }
}

const routeConverter: FirestoreDataConverter<Route> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    data.id = snapshot.id;

    if (data.updatedAt instanceof Timestamp) {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }

    return data as Route;
  },
  toFirestore: (route: Route) => {
    return route;
  },
};

const fareConverter: FirestoreDataConverter<Fares> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    data.id = snapshot.id;

    if (data.createdAt instanceof Timestamp) {
      data.createdAt = data.createdAt.toDate().toISOString();
    }

    return data as Fares;
  },
  toFirestore: (fare: Fares) => {
    return fare;
  },
};
