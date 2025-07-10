import React, { useEffect, useState } from 'react';
import { View, Text, AppState } from 'react-native';
import { Accelerometer, Magnetometer, Gyroscope } from 'expo-sensors';

export default function SensorLogger() {
  const [status, setStatus] = useState("Waiting...");
  const [latestVector, setLatestVector] = useState([]);

  useEffect(() => {
    let acc = {}, mag = {}, gyr = {};
    let rawVectors = [];
    let interval = null;

    // Set sensor update interval
    Accelerometer.setUpdateInterval(10);
    Magnetometer.setUpdateInterval(10);
    Gyroscope.setUpdateInterval(10);

    const accSub = Accelerometer.addListener(data => acc = data);
    const magSub = Magnetometer.addListener(data => mag = data);
    const gyrSub = Gyroscope.addListener(data => gyr = data);

    // Start collection
    setStatus("Collecting data...");
    let count = 0;

    interval = setInterval(() => {
      const vector = [
        acc.x ?? 0, acc.y ?? 0, acc.z ?? 0,
        mag.x ?? 0, mag.y ?? 0, mag.z ?? 0,
        gyr.x ?? 0, gyr.y ?? 0, gyr.z ?? 0
      ];

      rawVectors.push(vector);
      setLatestVector(vector);
      count++;

      // Stop after 1000 vectors (5s @ 10ms per sample)
      if (count >= 1000) {
        clearInterval(interval);
        accSub.remove(); magSub.remove(); gyrSub.remove();
        const flatVector = rawVectors.flat();
        sendToBackend(flatVector);
        setStatus("Data sent to backend");
      }
    }, 10);

    // Handle app backgrounding
    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active') {
        accSub.remove(); magSub.remove(); gyrSub.remove();
        clearInterval(interval);
        setStatus("App backgrounded. Data collection stopped.");
      }
    });

    return () => {
      accSub.remove(); magSub.remove(); gyrSub.remove();
      clearInterval(interval);
      appStateSub.remove();
    };
  }, []);

  const sendToBackend = async (flatVector) => {
    try {
      const res = await fetch('https://your-backend.com/api/biometrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector: flatVector })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error('Upload error:', err);
      setStatus("Upload failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{status}</Text>
      <Text style={{ marginTop: 10 }}>Latest 9x1 vector:</Text>
      <Text>{JSON.stringify(latestVector, null, 2)}</Text>
    </View>
  );
}
