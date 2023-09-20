"use client";
import React, { useEffect, useState } from "react";

// Define a TypeScript interface for the notification object
interface Notification {
  title: string;
  toDate: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState<number>(0);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/notifications`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notifications!");
      }

      const data: Notification[] = await res.json();

      const currentDate = new Date();
      const validNotifications = data.filter((notification) => {
        const toDate = new Date(notification.toDate);
        return toDate >= currentDate;
      });

      setNotifications(validNotifications);
      setCurrentNotificationIndex(0); // Reset to the first notification
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    // Fetch new notifications every 2 minutes
    const intervalId = setInterval(() => {
      if (notifications.length > 0) {
        setCurrentNotificationIndex((prevIndex) => (prevIndex + 1) % notifications.length);
      }
    }, 12000); // 2 minutes in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [notifications]);

  return (
    <div>
      {notifications.length > 0 ? (
        <div className="h-12 bg-red-500 text-white px-4 flex items-center justify-center text-center text-sm md:text-base cursor-pointer">
          {notifications.map((notification, index) => (
            <div key={index} style={{ display: index === currentNotificationIndex ? "block" : "none" }}>
              {notification.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-12 bg-gray-300 text-gray-600 px-4 flex items-center justify-center text-center text-sm md:text-base cursor-not-allowed">No notifications available</div>
      )}
    </div>
  );
};

export default Notification;
