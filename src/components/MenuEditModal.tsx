import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CategoryType } from "@/types/types";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedItem: CategoryType | null;
  onSubmit: (editedMenu: CategoryType) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, editedItem, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState(editedItem?.img || ""); // Initialize with the existing image URL
  const [file, setFile] = useState<File | null>(null);

  const [editedMenu, setEditedMenu] = useState<CategoryType | null>(editedItem);

  useEffect(() => {
    setEditedMenu(editedItem);
  }, [editedItem]);

  const upload = async () => {
    if (!file) {
      throw new Error("No file selected");
    }
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "flavorhaven");

      const res = await axios.post("https://api.cloudinary.com/v1_1/dsprb0p8v/image/upload", data);

      const { url } = res.data;
      return url;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload image");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedMenu((prev: CategoryType | null) => ({
      ...(prev as CategoryType),
      [name]: value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
    const url = URL.createObjectURL(item);
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      // Handle updates without changing the image separately
      if (editedMenu) {
        onSubmit(editedMenu);
      }
      onClose();
      return;
    }

    const url = await upload();
    const updatedMenu = editedMenu
      ? {
          ...editedMenu,
          img: url,
        }
      : null; // Ensure that updatedMenu is null if there's no editedMenu
    if (updatedMenu) {
      onSubmit(updatedMenu);
    }
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white w-100 rounded-lg shadow-lg p-11">
        <h1 className="text-4xl mb-8 text-gray-300 font-bold">Edit Menu Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              <img src={"/upload.png"} alt="" width={30} height={20} />
              <span>Change Image</span>
            </label>
            <input required type="file" onChange={handleChangeImg} id="file" className="hidden" />
            {imageUrl && <img src={imageUrl} alt="Uploaded" width={100} height={100} />}
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title:
            </label>
            <input
              required
              type="text"
              id="title"
              name="title"
              value={editedMenu?.title || ""}
              onChange={handleChange}
              className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            />
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
              Slug:
            </label>
            <input
              required
              type="text"
              id="slug"
              name="slug"
              value={editedMenu?.slug || ""}
              onChange={handleChange}
              className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            />
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
              Description:
            </label>
            <textarea
              required
              id="description"
              name="desc"
              value={editedMenu?.desc || ""}
              onChange={handleChange}
              className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            ></textarea>
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
              Color:
            </label>
            <select className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" id="color" name="color" value={editedMenu?.color || ""} onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
