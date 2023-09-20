import { CategoryType } from "@/types/types";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null); // Change the initial state

  const [menu, setMenu] = React.useState<CategoryType>({
    id: "",
    slug: "",
    title: "",
    desc: "",
    img: "",
    color: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenu((prev) => ({
      ...prev,
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

    // Check if a file has been selected for upload
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      const url = await upload();
      const newProduct = {
        img: url,
        ...menu,
      };
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      onClose();
      toast.success("Menu item added successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add menu item");
    } finally {
      // Reset the form after submission
      setFile(null);
      setMenu({
        id: "",
        slug: "",
        title: "",
        desc: "",
        img: "",
        color: "",
      });
      onClose();
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white w-100 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl mb-8 text-gray-300 font-bold">Add New Menu Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Upload Image:
            </label>
            <input type="file" id="file" onChange={handleChangeImg} className="hidden" />
            {imageUrl && <img src={imageUrl} alt="Uploaded" width={100} height={100} />}
          </div>
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title:
            </label>
            <input type="text" id="title" name="title" value={menu.title} onChange={handleChange} className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none" />
          </div>
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
              Slug:
            </label>
            <input type="text" id="slug" name="slug" value={menu.slug} onChange={handleChange} className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none" />
          </div>
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
              Description:
            </label>
            <textarea id="description" name="desc" value={menu.desc} onChange={handleChange} className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"></textarea>
          </div>
          <div className="w-full flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
              Color:
            </label>
            <input type="color" id="color" name="color" value={menu.color} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-red-500" />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
