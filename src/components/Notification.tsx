"use client";
import React, { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Function to fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/notifications?status=true`, {
        cache: "no-store",
      });

      if (res.status === 200) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch notifications from the server and store them
    fetchNotifications();
  }, []);

  return (
    <div>
      {notifications.length > 0 ? (
        <div className="h-12 bg-red-500 text-white px-4 flex items-center justify-center text-center text-sm md:text-base cursor-pointer">
          {notifications.map((notification, index) => notification.status === true && <div key={index}>{notification.title}</div>)}
        </div>
      ) : (
        <div className="h-12 bg-gray-300 text-gray-600 px-4 flex items-center justify-center text-center text-sm md:text-base cursor-not-allowed">No offers available</div>
      )}
    </div>
  );
};

export default Notification;
