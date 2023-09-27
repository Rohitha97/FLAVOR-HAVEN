import { ContactType } from "@/types/types";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";

interface MessageTableProps {
  message: ContactType[];
}

const MessageTable: React.FC<MessageTableProps> = ({ message }) => {
  const [messageList, setMessages] = useState<ContactType[]>([]);

  useEffect(() => {
    setMessages(message);
  }, [message]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/contact/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      const updatedMessages = messageList.filter((message) => message.id !== id);
      setMessages(updatedMessages);
      toast.success("Message deleted successfully");
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border border-gray-300">Name</th>
          <th className="py-2 px-4 border border-gray-300">Email</th>
          <th className="py-2 px-4 border border-gray-300">Subject</th>
          <th className="py-2 px-4 border border-gray-300">Message</th>
          <th className="py-2 px-4 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {messageList.map((message) => (
          <tr key={message.id} className="hover:bg-gray-200">
            <td className="py-2 px-4 border border-gray-300">{message.name}</td>
            <td className="py-2 px-4 border border-gray-300">{message.email}</td>
            <td className="py-2 px-4 border border-gray-300">{message.subject}</td>
            <td className="py-2 px-4 border border-gray-300">{message.message}</td>
            <td className="py-2 px-4 border border-gray-300">
              <button onClick={() => handleDelete(message.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded">
                <RiDeleteBinLine />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MessageTable;
