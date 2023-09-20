import { NortificationType } from "@/types/types";
import React from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notification: NortificationType) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [notification, setNotification] = React.useState<NortificationType>({
    id: "",
    title: "",
    toDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(notification);
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white w-150 rounded-lg shadow-md mb-10 p-11">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Notification</h1>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notification">
              Notification
            </label>
            <textarea
              rows={3}
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              placeholder="Enter notification"
              name="title"
              id="title"
              value={notification.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration
            </label>
            <input
              className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
              type="date"
              placeholder="Enter duration"
              name="toDate"
              value={notification.toDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full flex justify-end mt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 mr-2 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-12 rounded focus:outline-none focus:shadow-outline">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
