"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NotificationTable from "@/components/NotificationTable";
import NotificationModal from "@/components/NotificationModal";
import { CategoryType, ContactType, NotificationType } from "@/types/types";
import MenuForm from "@/components/MenuModal";
import MenuTable from "@/components/MenuTable";
import MenuModal from "@/components/MenuModal";
import MessageTable from "@/components/MessageTable";
import EditModal from "@/components/MenuEditModal";

// Define a TypeScript interface for the notification object

const SettingsPage = () => {
  const { data: session, status } = useSession();
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [messages, setMessages] = useState<ContactType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<CategoryType | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openMenuModal = () => {
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
    setEditedItem(null);
  };

  useEffect(() => {
    fetchNotifications();
    fetchCategories();
    fetchMessages();
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      fetchNotifications();
      fetchCategories();
    }
  }, [isSubmitted]);

  const handleSubmitPopup = async (notification: NotificationType) => {
    setIsLoading(true);

    try {
      const { id, ...newNotification } = notification;

      const res = await fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotification),
      });

      const data = await res.json();

      setIsSubmitted(true);
      toast.success("Notification added successfully");
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    } catch (err) {
      toast.error("Failed to add notification");
    } finally {
      setIsLoading(false);
    }

    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.setAttribute("disabled", "true");
    }
  };
  const handleSubmit = async (menu: CategoryType) => {
    setIsLoading(true);

    try {
      const { id, ...newMenu } = menu;

      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenu),
      });

      setIsSubmitted(true);
      toast.success("Menu item added successfully");
    } catch (err) {
      toast.error("Failed to add Menu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    console.log("fetchNotifications called");
    try {
      const res = await fetch("http://localhost:3000/api/notifications", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notifications!");
      }

      const data: NotificationType[] = await res.json();

      // const currentDate = new Date();
      // const validNotifications = data.filter((notification) => {
      //   const toDate = notification.toDate ? new Date(notification.toDate) : new Date();
      //   return toDate >= currentDate;
      // });

      // console.log("Fetched notifications:", validNotifications);

      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    console.log("fetchCategories called");
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch categories!");
      }
      const data: CategoryType[] = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    console.log("fetchMessages called");
    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch messages!");
      }
      console.log("res", res);
      const data: ContactType[] = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderForm = () => {
    const notificationForm = (
      <div className="mb-10 p-4">
        <button className="bg-black text-white py-2 px-4 mb-3 rounded mt-4 hover:bg-slate-600 focus:outline-none" onClick={() => setIsModalOpen(true)}>
          Add Notification
        </button>
        <NotificationTable notifications={notifications} />
        <NotificationModal isOpen={isModalOpen} onClose={() => closeModal()} onSubmit={handleSubmitPopup} />
      </div>
    );
    const menuForm = (
      <div className="mb-10 p-4">
        <button
          className="bg-black text-white py-2 px-4 mb-3 rounded mt-4 hover:bg-slate-600 focus:outline-none"
          onClick={() => {
            setEditedItem(null);
            openMenuModal();
          }}
        >
          Add Menu
        </button>
        <MenuTable categories={categories} />
        <MenuModal isOpen={isMenuModalOpen} onClose={closeMenuModal} onSubmit={handleSubmit} editedItem={editedItem} />
      </div>
    );
    const messageTable = (
      <div className="mb-10 p-4">
        <MessageTable message={messages} />
      </div>
    );
    switch (selectedOption) {
      case "notifications":
        return notificationForm;
      case "menu":
        return menuForm;
      case "message":
        return messageTable;
      default:
        return notificationForm;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/5 p-4">
        <h1 className="text-3xl text-center text-red-500 border-red-500 font-bold mb-4">Settings</h1>
        <button
          className={`w-full py-2 px-4 rounded ${selectedOption === "notifications" || selectedOption === "" ? "bg-red-500 text-white" : "hover:bg-red-500 focus:outline-none"}`}
          onClick={() => setSelectedOption("notifications")}
        >
          Notifications
        </button>
        <button className={`w-full py-2 px-4 rounded mt-4 ${selectedOption === "menu" ? "bg-red-500 text-white" : "hover:bg-red-500 focus:outline-none"}`} onClick={() => setSelectedOption("menu")}>
          Menu
        </button>
        <button
          className={`w-full py-2 px-4 rounded mt-4 ${selectedOption === "message" ? "bg-red-500 text-white" : "hover:bg-red-500 focus:outline-none"}`}
          onClick={() => setSelectedOption("message")}
        >
          Messages
        </button>
      </div>
      <div className="w-3/4 p-4">{renderForm()}</div>
    </div>
  );
};

export default SettingsPage;
