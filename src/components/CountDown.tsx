import React, { useEffect, useState, Suspense } from 'react';

const Countdown = ({ targetDate }: any) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const total = Date.parse(targetDate) - Date.parse(new Date());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    const milliseconds = total % 1000;
    return { total, days, hours, minutes, seconds, milliseconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <div className="text-3xl font-bold mr-2">
        <Suspense fallback>
          {timeRemaining.days}d{' '}
          {('0' + timeRemaining.hours).slice(-2)}:{('0' + timeRemaining.minutes).slice(-2)}:
          {('0' + timeRemaining.seconds).slice(-2)}:{('00' + timeRemaining.milliseconds).slice(-3)}
        </Suspense>
      </div>
      <div className="text-gray-800 font-bold">Faltam</div>
    </div>
  );
};

export default Countdown;
