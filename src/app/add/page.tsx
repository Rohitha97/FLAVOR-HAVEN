"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MenuType } from "@/types/types";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: number;
  isFeatured: boolean;
};

type Option = {
  title: string;
  additionalPrice: number;
};

type Category = {
  id: string;
  title: string;
  slug: string;
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: 0,
    isFeatured: false,
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === "isFeatured" ? e.target.value === "true" : e.target.value;
    setInputs((prev) => {
      return { ...prev, [e.target.name]: value };
    });
  };

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === "additionalPrice" ? parseFloat(e.target.value) : e.target.value;
    setOption((prev) => {
      return { ...prev, [e.target.name]: value };
    });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
    const url = URL.createObjectURL(item);
    setImageUrl(url);
  };

  const upload = async () => {
    if (!file) {
      throw new Error("No file selected");
    }
    try {
      const data = new FormData();
      data.append("file", file!);
      data.append("upload_preset", "flavorhaven");

      const res = await axios.post("https://api.cloudinary.com/v1_1/dsprb0p8v/image/upload", data);

      const { url } = res.data;
      return url;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || isSubmitted) {
      return;
    }

    // Check if a file has been selected for upload
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsLoading(true);

    try {
      const url = await upload();
      const newProduct = {
        img: url,
        ...inputs,
        options,
      };
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      setIsSubmitted(true);

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }

    // Disable the submit button after the form is submitted
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.setAttribute("disabled", "true");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  return (
    <div className="mt-12 bg-white rounded px-72 pt-6 pb-8 mb-4 flex items-center justify-center text-red-500">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Product</h1>
        <div className="w-full flex flex-col mt-4 ">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            <Image src={imageUrl || "/upload.png"} alt="" width={30} height={20} />
            <span>Upload Image</span>
          </label>
          <input type="file" onChange={handleChangeImg} id="file" className="hidden" />
          {imageUrl && <Image src={imageUrl} alt="Uploaded" width={200} height={200} />}
        </div>
        <div className="w-full flex flex-col mt-4 ">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" type="text" placeholder="Bella Napoli" name="title" onChange={handleChange} />
        </div>
        <div className="w-full flex flex-col mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col mt-4 ">
          <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
          <input className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" type="number" placeholder="29" name="price" onChange={handleChange} />
        </div>

        <div className="w-full flex flex-row mt-4 ">
          <div className="w-1/2 flex flex-col mt-4 mr-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <select className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" name="catSlug" onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          {/* Featured product yes or no select tag */}
          <div className="w-1/2 flex flex-col mt-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2">Featured</label>
            <select className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" name="isFeatured" onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="w-full flex flex-col mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
          <div className="flex">
            <input className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" type="text" placeholder="Title" name="title" onChange={changeOption} />
            <input className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" type="number" placeholder="Additional Price" name="additionalPrice" onChange={changeOption} />
            <button
              className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={(e) => {
                e.preventDefault();
                setOptions((prev) => [...prev, option]);
              }}
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {options.map((opt) => (
              <div key={opt.title} className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400" onClick={() => setOptions((prev) => prev.filter((item) => item.title !== opt.title))}>
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-12 rounded focus:outline-none focus:shadow-outline" disabled={isLoading || isSubmitted}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;
