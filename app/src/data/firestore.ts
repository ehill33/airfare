import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import { db } from './firebase';

export type Trip = {
  id: string;
  name: string;
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
  cheapest: Fare;
  best: Fare;
  quickest: Fare;
};

export type FareClass = 'economy' | 'business';
export type FareType = keyof Fares;

export type Fare = {
  price: number;
  duration: number;
};

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

export async function getRouteHistory(
  tripId: string,
  routeId: string,
  cabinClass: string
) {
  try {
    return await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .doc(routeId)
      .collection(cabinClass)
      .get();
  } catch (error) {
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
