// src/lib/deviceId.js
import { v4 as uuidv4 } from 'uuid';

const getDeviceId = () => {
  // This check ensures the code only runs on the client side,
  // preventing "localStorage is not defined" errors during server-side rendering (SSR) in Next.js.
  if (typeof window === 'undefined') {
    return null;
  }

  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

export default getDeviceId;