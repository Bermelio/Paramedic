import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("es-AR");

  return (
    <>
      <div className="flex justify-end items-center gap-2 text-gray-700 text-xs sm:text-base lg:text-lg">
        <strong>San Francisco</strong>
        <p>{formattedDate} - {formattedTime}</p>
      </div>
    </>
  );
}

export default Clock;