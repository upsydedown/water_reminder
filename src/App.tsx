import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Plus, Minus, RefreshCw } from 'lucide-react';
import { WaterScene } from './components/WaterScene';
import { ReminderTimer } from './components/ReminderTimer';

const DAILY_GOAL = 2000; // 2000ml daily goal
const GLASS_SIZE = 250; // 250ml per glass

function App() {
  const [intake, setIntake] = useState(() => {
    const saved = localStorage.getItem('waterIntake');
    return saved ? JSON.parse(saved) : 0;
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    const saved = localStorage.getItem('lastUpdated');
    return saved ? new Date(JSON.parse(saved)) : new Date();
  });

  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify(intake));
    localStorage.setItem('lastUpdated', JSON.stringify(lastUpdated));
  }, [intake, lastUpdated]);

  useEffect(() => {
    const now = new Date();
    if (now.getDate() !== lastUpdated.getDate()) {
      setIntake(0);
      setLastUpdated(now);
    }
  }, [lastUpdated]);

  const percentage = Math.min((intake / DAILY_GOAL) * 100, 100);

  const addWater = () => {
    setIntake(prev => Math.min(prev + GLASS_SIZE, DAILY_GOAL));
    setLastUpdated(new Date());
  };

  const removeWater = () => {
    setIntake(prev => Math.max(prev - GLASS_SIZE, 0));
    setLastUpdated(new Date());
  };

  const resetWater = () => {
    setIntake(0);
    setLastUpdated(new Date());
  };

  const handleNotification = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Water Reminder', {
            body: "It's time to drink water!",
            icon: '/water-drop.png'
          });
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">Water Reminder</h1>
            </div>
            <button
              onClick={resetWater}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <WaterScene percentage={percentage} />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Daily Progress</span>
              <span className="text-lg font-bold text-blue-600">
                {intake}ml / {DAILY_GOAL}ml
              </span>
            </div>

            <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={removeWater}
                className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                disabled={intake === 0}
              >
                <Minus className="w-6 h-6" />
              </button>
              <button
                onClick={addWater}
                className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                disabled={intake === DAILY_GOAL}
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Each glass is {GLASS_SIZE}ml
            </p>
          </div>
        </div>

        <ReminderTimer onNotification={handleNotification} />
      </div>
    </div>
  );
}

export default App;