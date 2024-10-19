// utils/storage.ts
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const uploadTestData = async (userId: string, testData: any) => {
  try {
    const { setDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    const testId = `test_${Date.now()}`;
    const userDocRef = doc(db, 'users', userId, 'tests', testId);
    
    await setDoc(userDocRef, testData);
    return testId;
  } catch (error) {
    console.error('Error saving test data:', error);
    throw error;
  }
};