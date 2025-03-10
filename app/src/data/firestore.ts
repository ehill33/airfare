import { db } from './firebase';

type Trip = {
  id: string;
  name: string;
};

type Route = {
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

export async function getTripRoutes(tripId: string): Promise<Route[]> {
  try {
    const routesSnapshot = await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .orderBy('economy.cheapest.price', 'asc')
      .get();

    return routesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Route)
    );
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
