import { useEffect, useState } from "react";
import "./SplashScreen.css";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + step, 100);

        if (next >= 100) {
          clearInterval(timer);
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="splash-screen-container">
      <div className="splash-screen__content">
        <div
          className="loading-circle"
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          style={{ "--progress": `${progress * 3.6}deg` }}
        >
          <img
            src="/almosanadah.png"
            alt="Almosanadah Institute"
            className="splash-screen__logo"
          />

          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      <p className="splash-screen__text"> ... Preparing your experience </p>
    </div>
  );
}
