import React, { useEffect, useState, useRef } from 'react';
import { View, Text, AppState } from 'react-native';
import { Accelerometer, Magnetometer, Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SensorLogger() {
  const [status, setStatus] = useState("Waiting...");
  const [latestVector, setLatestVector] = useState([]);
  const appState = useRef(AppState.currentState);
  const collectingRef = useRef(false);
  const intervalRef = useRef(null);
  const vectorRef = useRef([]);

  const startCollection = () => {
    let acc = {}, mag = {}, gyr = {};
    vectorRef.current = [];
    collectingRef.current = true;

    Accelerometer.setUpdateInterval(10);
    Magnetometer.setUpdateInterval(10);
    Gyroscope.setUpdateInterval(10);

    const accSub = Accelerometer.addListener(data => acc = data);
    const magSub = Magnetometer.addListener(data => mag = data);
    const gyrSub = Gyroscope.addListener(data => gyr = data);

    setStatus("Collecting sensor data...");

    let count = 0;
    intervalRef.current = setInterval(async () => {
      if (!collectingRef.current) return;

      const vector = [
        acc.x ?? 0, acc.y ?? 0, acc.z ?? 0,
        mag.x ?? 0, mag.y ?? 0, mag.z ?? 0,
        gyr.x ?? 0, gyr.y ?? 0, gyr.z ?? 0
      ];

      setLatestVector(vector);
      vectorRef.current.push(vector);
      count++;

      if (count >= 1024) {
        stopCollection();
        const flatVector = vectorRef.current.flat();
        setStatus("Sending to backend...");
        await sendToBackend(flatVector);
        setStatus("Restarting collection...");
        startCollection();
      }
    }, 10);

    return () => {
      accSub.remove();
      magSub.remove();
      gyrSub.remove();
    };
  };

  const stopCollection = () => {
    collectingRef.current = false;
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startCollection();

    const sub = AppState.addEventListener("change", nextState => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        // App came back
        console.log("🔄 App resumed — restarting collection");
        startCollection();
      } else if (nextState !== "active") {
        console.log("⏸ App backgrounded — stopping collection");
        stopCollection();
      }
      appState.current = nextState;
    });

    return () => {
      stopCollection();
      sub.remove();
    };
  }, []);

  const sendToBackend = async (flatVector) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch('http://192.168.1.108:5001/api/biometrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
