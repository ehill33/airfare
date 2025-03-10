import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from '../firebaseServiceAccount.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = getFirestore()
