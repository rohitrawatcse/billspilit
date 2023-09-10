import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  
};
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db=getFirestore()
export default app;
export const storage = getStorage(app);
export const provider=new GoogleAuthProvider();