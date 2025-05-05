
"use client";

import { useState, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const form = useRef<HTMLFormElement>(null);
  const [buttonText, setButtonText] = useState("Send Message");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonText("Sending...");

    if (!form.current) {
      setButtonText("Send Message");
      return;
    }

    const formData = new FormData(form.current);
    const userEmail = formData.get("email") as string;
    const userName = formData.get("name") as string;
    const userMessage = formData.get("message") as string;

    const templateParams = {
      from_name: "Medicine Website Contact",
      from_email: userEmail,
      name: userName,
      message: userMessage,
    };

    emailjs
      .send('service_o8upbpr', 'template_xafqw9e', templateParams, 'ZF5npbVhSWZvkYdcx')
      .then(
        () => {
          setButtonText('Sent');
          setTimeout(() => {
            setButtonText('Send Me');
            form.current?.reset();
          }, 1000);
        },
        (error) => {
          console.error('EmailJS error:', error.text);
          setButtonText('Send Me');
        }
      );
  };

  return (
    <div
      className="w-full lg:-[70vh] relative bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/0QqxrT68/5522.jpg')", // Medicine-themed background
      }}
    >
      <div className="flex justify-center items-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-xl p-8 lg:w-3/5 w-full">
          <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
            Contact Us
          </h1>
          <form ref={form} onSubmit={sendEmail} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                required
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
            </div>
            <textarea
              required
              name="message"
              placeholder="Write your message here ..."
              className="w-full h-36 p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2"
                disabled={buttonText === "Sending..."}
              >
                {buttonText}
                <RiSendPlaneFill className="text-xl" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;