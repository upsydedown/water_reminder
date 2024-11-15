import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface ReminderTimerProps {
  onNotification: () => void;
}

export function ReminderTimer({ onNotification }: ReminderTimerProps) {
  const [interval, setInterval] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interval * 60);

  useEffect(() => {
    let timer: number;
    
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onNotification();
            return interval * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, interval, onNotification]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setTimeLeft(interval * 60);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Reminder Timer</h2>
        <button
          onClick={toggleTimer}
          className={`p-2 rounded-full ${
            isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          } hover:opacity-80 transition-colors`}
        >
          {isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="15"
          max="120"
          step="15"
          value={interval}
          onChange={(e) => {
            setInterval(Number(e.target.value));
            setTimeLeft(Number(e.target.value) * 60);
          }}
          className="flex-1"
          disabled={isActive}
        />
        <span className="text-sm text-gray-600 w-16">{interval}min</span>
      </div>
      
      <div className="text-center">
        <span className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}