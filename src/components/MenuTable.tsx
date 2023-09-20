import { CategoryType } from "@/types/types";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CategoryTableProps {
  category: CategoryType[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ category }) => {
  const [categoryList, setCategorys] = useState<CategoryType[]>([]);

  useEffect(() => {
    setCategorys(category);
  }, [category]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/category/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      const updatedCategorys = categoryList.filter((category) => category.id !== id);
      setCategorys(updatedCategorys);
      toast.success("Category deleted successfully");
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  };

  return (
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
            <td className="py-2 px-4 border border-gray-300">{category.img}</td>
            <td className="py-2 px-4 border border-gray-300">{category.title}</td>
            <td className="py-2 px-4 border border-gray-300">{category.desc}</td>
            <td className="py-2 px-4 border border-gray-300">{category.color}</td>
            <td className="py-2 px-4 border border-gray-300">{category.slug}</td>
            <td className="py-2 px-4 border border-gray-300">
              <button onClick={() => handleDelete(category.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
