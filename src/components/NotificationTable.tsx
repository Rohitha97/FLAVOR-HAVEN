import { NotificationType } from "@/types/types";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiBell, BiBellOff } from "react-icons/bi";

interface NotificationTableProps {
  notifications: NotificationType[];
}

const NotificationTable: React.FC<NotificationTableProps> = ({ notifications }) => {
  const [notificationList, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    setNotifications(notifications);
  }, [notifications]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/notifications/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      const updatedNotifications = notificationList.filter((notification) => notification.id !== id);
      setNotifications(updatedNotifications);
      toast.success("Notification deleted successfully");
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    const res = await fetch(`http://localhost:3000/api/notifications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.status === 200) {
      setNotifications((prevNotifications) => {
        return prevNotifications.map((notification) => {
          if (notification.id === id) {
            // Update the status of the specific notification
            return {
              ...notification,
              status: newStatus,
            };
          }
          return notification;
        });
      });
      toast.success("Notification status updated successfully");
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  };

  useEffect(() => {
    // Refresh the table when the notificationList state variable changes
    setNotifications(notifications);
  }, [notificationList]);

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border border-gray-300">Notification</th>
          <th className="py-2 px-4 border border-gray-300">Expiration Date</th>
          <th className="py-2 px-4 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {notificationList.map((notification) => (
          <tr key={notification.id} className="hover:bg-gray-200">
            <td className="py-2 px-4 border border-gray-300">{notification.title}</td>
            <td className="py-2 px-4 border border-gray-300">{notification.toDate ?? ""}</td>
            <td className="py-2 px-4 border border-gray-300">
              <button onClick={() => handleDelete(notification.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded">
                <RiDeleteBinLine />
              </button>
              <button
                onClick={() => handleStatusChange(notification.id, !notification.status)}
                className={`${notification.status ? "bg-green-500 hover:bg-green-700" : "bg-slate-300"} text-white px-2 py-1 rounded ml-2`}
              >
                {notification.status ? <BiBell /> : <BiBellOff />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NotificationTable;
