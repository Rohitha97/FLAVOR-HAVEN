"use client";
import { ContactType } from "@/types/types";
import React, { useState } from "react";
import { GrFacebook, GrInstagram, GrMail, GrYoutube } from "react-icons/gr";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<ContactType>({
    id: "",
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const message = {
        ...inputs,
      };
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (res.ok) {
        // show success message on top of the page
        toast.success("Message sent successfully");

        setInputs({
          id: "",
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // reset input
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:px-20 xl:px-60 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center">
      <div className="container mx-auto bg-black py-10 rounded-md shadow-gray-700 shadow-2xl">
        <div className="flex justify-center">
          <div className="lg:w-10/12 md:w-full">
            <div className="flex flex-wrap">
              <div className="md:w-7/12">
                <div className="p-0 md:p-5">
                  <h1 className="text-4xl mb-4 text-gray-300 font-bold">Get in touch</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-56 mb-4 mr-5">
                        <div className="relative">
                          <input
                            required
                            type="text"
                            className="w-full py-2 px-3 rounded border focus:outline-none focus:border-red-500"
                            name="name"
                            id="name"
                            placeholder="Name"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-56 mb-4">
                        <div className="relative">
                          <input
                            required
                            type="email"
                            className="w-full py-2 px-3 rounded border focus:outline-none focus:border-red-500"
                            name="email"
                            id="email"
                            placeholder="Email"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="w-full mb-4">
                        <div className="relative">
                          <input
                            required
                            type="text"
                            className="w-full py-2 px-3 rounded border focus:outline-none focus:border-red-500"
                            name="subject"
                            id="subject"
                            placeholder="Subject"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="w-full mb-4">
                        <div className="relative">
                          <textarea
                            name="message"
                            className="w-full py-2 px-3 rounded border focus:outline-none focus:border-red-500"
                            id="message"
                            cols={30}
                            rows={7}
                            placeholder="Message"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="w-full mt-3">
                        <button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700" disabled={isLoading}>
                          {isLoading ? "Loading..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="md:w-5/12 bg-gray-900">
                <div className="p-5">
                  <h1 className="text-4xl mb-4 text-gray-300 font-bold">Contact us</h1>
                  <div className="flex items-start mb-4">
                    <div className="mr-3">
                      <span className="fa fa-map-marker text-white"></span>
                    </div>
                    <div className="text-white">
                      <p>
                        Address
                        <br />
                        <span>
                          <a href="#">No 40 Baria Sreet 133/2 Malabe, Colombo. </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="mr-3">
                      <span className="fa fa-phone text-white"></span>
                    </div>
                    <div className="text-white">
                      <p>
                        Phone
                        <br />
                        <span>
                          <a href="#">0118564775</a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="mr-3">
                      <span className="fa fa-paper-plane text-white"></span>
                    </div>
                    <div className="text-white">
                      <p>
                        Email
                        <br />
                        <span>
                          <a href="mailto:flavorhaven@info.com">flavorhaven@info.com</a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center my-3">
                    <div className="m-3 p-2">
                      <a href="#" className="text-white">
                        <GrMail size={30} />
                      </a>
                    </div>
                    <div className="m-3 p-2">
                      <a href="#" className="text-white">
                        <GrFacebook size={30} />
                      </a>
                    </div>
                    <div className="m-3 p-2">
                      <a href="#" className="text-white">
                        <GrInstagram size={30} />
                      </a>
                    </div>
                    <div className="m-3 p-2">
                      <a href="#" className="text-white">
                        <GrYoutube size={30} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;
