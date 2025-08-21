import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * Listen in real-time to changes in the "pantry" collection.
 * 
 * @param {Function} callback - A function that will be called whenever the pantry data changes.
 * The callback receives an array of pantry items, where each item includes:
 *  - name: The document ID (item name)
 *  - quantity: The current quantity of the item
 *  - ...other fields if present
 * 
 * @returns {Function} - An unsubscribe function to stop listening when called.
 */
export const listenToItems = (callback) => {
  const colRef = collection(firestore, "pantry");
  return onSnapshot(colRef, (snap) => {
    const list = snap.docs.map((d) => ({ name: d.id, ...(d.data() || {}) }));
    callback(list);
  });
};

/**
 * Get all items in the "pantry" collection once (non-realtime).
 * 
 * @async
 * @returns {Promise<Array>} - Resolves to an array of pantry items.
 * Each item includes:
 *  - name: The document ID (item name)
 *  - quantity: The current quantity of the item
 *  - ...other fields if present
 */
export const getItems = async () => {
  const snapshot = query(collection(firestore, 'pantry'));
  const docs = await getDocs(snapshot);
  const inventoryList = [];
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() });
  });
  return inventoryList;
};

/**
 * Add a new item to the pantry or update its quantity if it already exists.
 * 
 * @async
 * @param {string} item - The name of the item to add.
 * If the item already exists, increments its quantity by 1.
 * If it does not exist, creates it with a starting quantity of 1.
 */
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

/**
 * Remove an item from the pantry or decrement its quantity.
 * 
 * @async
 * @param {string} item - The name of the item to remove.
 * If the item's quantity is greater than 1, decrements it by 1.
 * If the quantity is exactly 1, deletes the item from the collection entirely.
 */
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