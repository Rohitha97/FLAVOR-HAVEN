"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NotificationTable from "@/components/NotificationTable";
import NotificationModal from "@/components/NotificationModal";
import { NortificationType } from "@/types/types";
import MenuForm from "@/components/MenuForm";

// Define a TypeScript interface for the notification object

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notifications, setNotifications] = useState<NortificationType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    if (isSubmitted) {
      fetchNotifications();
    }
  }, [isSubmitted]);

  //   if (status === "unauthenticated") {
  //     router.push("/");
  //   }

  const handleSubmitPopup = async (notification: NortificationType) => {
    setIsLoading(true);

    try {
      // Exclude the 'id' property from the new notification object
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
      window.location.reload();
    } catch (err) {
      toast.error("Failed to add notification");
    } finally {
      setIsLoading(false);
    }

    // Disable the submit button after the form is submitted
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.setAttribute("disabled", "true");
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

      const data: NortificationType[] = await res.json();

      const currentDate = new Date();
      const validNotifications = data.filter((notification) => {
        const toDate = notification.toDate ? new Date(notification.toDate) : new Date();
        return toDate >= currentDate;
      });

      console.log("Fetched notifications:", validNotifications);

      setNotifications(validNotifications);
    } catch (error) {
      console.error(error);
    }
  };

  const renderForm = () => {
    const notificationForm = (
      <div className="mb-10 p-4">
        <button className="bg-black text-white py-2 px-4 mb-3 rounded mt-4 hover:bg-slate-600 focus:outline-none" onClick={() => setIsModalOpen(true)}>
          Add Nortification
        </button>
        <NotificationTable notifications={notifications} />
        <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitPopup} />
      </div>
    );
    const menuForm = (
      <div className="mb-10 p-4">
        <button className="bg-black text-white py-2 px-4 mb-3 rounded mt-4 hover:bg-slate-600 focus:outline-none" onClick={() => setIsMenuModalOpen(true)}>
          Add Menu
        </button>
        <NotificationTable notifications={notifications} />
        <MenuForm isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} />
      </div>
    );
    switch (selectedOption) {
      case "notifications":
        return notificationForm;
      case "menu":
        return menuForm;
      default:
        return notificationForm;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/5 p-4 ">
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
      </div>
      <div className="w-3/4 p-4">{renderForm()}</div>
    </div>
  );
};

export default SettingsPage;
