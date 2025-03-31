import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebase.js';

export async function getTrip(tripId) {
  const tripSnapshot = await db.collection('trips').doc(tripId).get();
  return tripSnapshot.data();
}

export async function getAirfares(tripId, routeId, cabinClass) {
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

export async function addAirfares(tripId, airfares) {
  const {
    cabinClass,
    fromAirport,
    toAirport,
    startDate,
    endDate,
    cheapest,
    best,
    quickest,
  } = airfares;

  const timestamp = FieldValue.serverTimestamp();

  const routeId = `${fromAirport}-${toAirport}`;

  const routeRef = db
    .collection('trips')
    .doc(tripId)
    .collection('routes')
    .doc(routeId);

  // Update the route with the latest fare data
  const routeData = {
    fromAirport,
    toAirport,
    startDate,
    endDate,
    updatedAt: timestamp,
    [cabinClass]: {
      cheapest,
      best,
      quickest,
    },
  };
  await routeRef.set(routeData, { merge: true });

  // Add the fare data to the collection
  const fareData = {
    cheapest,
    best,
    quickest,
    createdAt: timestamp,
  };
  return await routeRef.collection(cabinClass).add(fareData);
}

export async function getTripRoutes(tripId) {
  try {
    return await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .orderBy('economy.cheapest.price', 'asc')
      .get();
  } catch (error) {
    console.error(error);
  }
}

export async function getRouteHistory(tripId, routeId, cabinClass) {
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

// Use collection group to get latest airfares from each route in the trip
export async function getLatestAirfares(tripId, cabinClass) {
  const cabinClassRef = db.collectionGroup(cabinClass);
  return await cabinClassRef
    //   .where('tripId', '==', tripId)
    .limit(1)
    .get();
}

export async function getLatestTripInfoForCabinClass(tripId, cabinClass) {
  try {
    // Get all route IDs for the trip
    const routesSnapshot = await db
      .collection('trips')
      .doc(tripId)
      .collection('routes')
      .get();

    const routesSnapshot2 = await routesSnapshot.collection('routes').get();
    const routeIds = routesSnapshot.docs.map((doc) => doc.id);

    // Prepare batch of reads
    const refs = routeIds.map((routeId) =>
      db
        .collection('trips')
        .doc(tripId)
        .collection('routes')
        .doc(routeId)
        .collection(cabinClass)
        .orderBy('createdAt', 'desc')
        .limit(1)
    );

    // Execute batch read
    const snapshots = await db.getAll(...refs);

    // Process results
    const results = {};
    snapshots.forEach((snapshot, index) => {
      if (!snapshot.empty) {
        results[routeIds[index]] = snapshot.docs[0].data();
      }
    });

    return results;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
}
