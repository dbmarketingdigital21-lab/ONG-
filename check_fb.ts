import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfigParams = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfigParams);
const dbFirestore = getFirestore(firebaseApp, firebaseConfigParams.firestoreDatabaseId);

async function check() {
  const s = await getDoc(doc(dbFirestore, "tables", "instituicao"));
  console.log("Instituicao data from Firebase:", JSON.parse(s.data().data).cidade);
  process.exit(0);
}
check();
