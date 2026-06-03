import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfigParams = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfigParams);
const dbFirestore = getFirestore(firebaseApp);

async function test() {
  console.log("Starting test..", firebaseConfigParams.projectId);
  try {
     await setDoc(doc(dbFirestore, "tables", "test"), { hello: "world" });
     console.log("Set doc ok");
  } catch(e) {
     console.error(e);
  }
  process.exit();
}
test();
