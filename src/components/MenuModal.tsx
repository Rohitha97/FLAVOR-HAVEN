import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CategoryType } from "@/types/types";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (menu: CategoryType) => void;
  editedItem?: CategoryType | null;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, onSubmit, editedItem }) => {
  const [imageUrl, setImageUrl] = useState<string>(editedItem?.img || "");
  const [file, setFile] = useState<File | null>(null);
  const [menu, setMenu] = useState<CategoryType>({
    id: "",
    slug: "",
    title: "",
    desc: "",
    img: "",
    color: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (editedItem) {
        setMenu(editedItem);
        setImageUrl(editedItem.img || "");
      } else {
        setMenu({
          id: "",
          slug: "",
          title: "",
          desc: "",
          img: "",
          color: "",
        });
        setImageUrl("");
      }
    }
  }, [isOpen, editedItem]);

  const isEditMode = !!editedItem;

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
    setMenu((prev) => ({ ...prev, [name]: value }));
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

    if (!file && !isEditMode) {
      toast.error("Please select an image.");
      return;
    }

    const url = file ? await upload() : menu.img;

    const updatedMenu = {
      ...menu,
      img: url,
    };

    onSubmit(updatedMenu);
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white w-100 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl px-16 mb-8 text-gray-300 font-bold">{isEditMode ? "Edit Menu Item" : "Add New Menu Item"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              <img src="/upload.png" alt="" width={30} height={20} />
              <span>Upload Image</span>
            </label>
            <input type="file" onChange={handleChangeImg} id="file" className="hidden" />
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
              value={menu.title}
              onChange={handleChange}
              className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            />
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
              Slug:
            </label>
            <input required type="text" id="slug" name="slug" value={menu.slug} onChange={handleChange} className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none" />
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
              Description:
            </label>
            <textarea
              required
              id="description"
              name="desc"
              value={menu.desc}
              onChange={handleChange}
              className="w-full ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            ></textarea>
          </div>
          <div className="w-full flex flex-col mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
              Color:
            </label>
            <select className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" id="color" name="color" value={menu.color} onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {isEditMode ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
