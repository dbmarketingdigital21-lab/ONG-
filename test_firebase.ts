import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfigParams = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const app = initializeApp(firebaseConfigParams);
const db = getFirestore(app);

async function testFirebase() {
  await setDoc(doc(db, 'test', '1'), { works: true });
  const snapshot = await getDocs(collection(db, 'test'));
  console.log('Docs:', snapshot.docs.map(d => d.data()));
  process.exit(0);
}

testFirebase().catch(console.error);
