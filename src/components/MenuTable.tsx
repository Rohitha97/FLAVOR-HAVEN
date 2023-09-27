import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CategoryType } from "@/types/types";
import MenuModal from "./MenuModal";
import { RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";

interface CategoryTableProps {
  categories: CategoryType[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the Edit Modal
  const [editItem, setEditItem] = useState<CategoryType | null>(null);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        const updatedCategories = categoryList.filter((category) => category.id !== id);
        setCategoryList(updatedCategories);
        toast.success("Category deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (item: CategoryType) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const handleFormSubmit = async (editedMenu: CategoryType) => {
    try {
      const res = await fetch(`http://localhost:3000/api/categories/${editedMenu.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedMenu),
      });

      if (res.status === 200) {
        const updatedCategories = categoryList.map((category) => (category.id === editedMenu.id ? editedMenu : category));
        setCategoryList(updatedCategories);

        toast.success("Menu updated successfully");
        closeEditModal();
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border border-gray-300">Image</th>
            <th className="py-2 px-4 border border-gray-300">Title</th>
            <th className="py-2 px-4 border border-gray-300">Description</th>
            <th className="py-2 px-4 border border-gray-300">Color</th>
            <th className="py-2 px-4 border border-gray-300">Slug</th>
            <th className="py-2 px-4 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.map((category) => (
            <tr key={category.id} className="hover:bg-gray-200">
              <td className="py-2 px-4 border border-gray-300">
                <img src={category.img || "/upload.png"} alt="" width={100} height={100} />
              </td>
              <td className="py-2 px-4 border border-gray-300">{category.title}</td>
              <td className="py-2 px-4 border border-gray-300">{category.desc}</td>
              <td className="py-2 px-4 border border-gray-300">{category.color}</td>
              <td className="py-2 px-4 border border-gray-300">{category.slug}</td>
              <td className="py-2 px-4 border border-gray-300">
                <button onClick={() => handleDelete(category.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 mr-1 rounded">
                  <RiDeleteBinLine />
                </button>
                <button onClick={() => handleEdit(category)} className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded">
                  <RiEdit2Fill />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && <MenuModal isOpen={isEditModalOpen} onClose={closeEditModal} onSubmit={handleFormSubmit} editedItem={editItem} />}
    </div>
  );
};

export default CategoryTable;
