import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  if (!serviceAccount) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = getFirestore();
