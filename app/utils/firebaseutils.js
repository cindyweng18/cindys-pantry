import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, onSnapshot } from 'firebase/firestore';

export const listenToItems = (callback) => {
  const colRef = collection(firestore, "pantry");
  return onSnapshot(colRef, (snap) => {
    const list = snap.docs.map((d) => ({ name: d.id, ...(d.data() || {}) }));
    callback(list);
  });
};


export const getItems = async () => {
  const snapshot = query(collection(firestore, 'pantry'));
  const docs = await getDocs(snapshot);
  const inventoryList = [];
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() });
  });
  return inventoryList;
};

export const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    await setDoc(docRef, { quantity: quantity + 1 });
  } else {
    await setDoc(docRef, { name: item, quantity: 1 });
  }
};

export const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    if (quantity === 1) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { quantity: quantity - 1 });
    }
  }
};