
"use client";

import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faComments,
  faPhoneVolume,
  faEnvelopeOpenText,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";

const contactPoints = [
  { icon: faPhoneVolume, label: "+1 (415) 555-0198" },
  { icon: faEnvelopeOpenText, label: "support@finemed.com" },
  { icon: faLocationDot, label: "742 Evergreen Terrace, Springfield, IL" },
];

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
            setButtonText('Send Message');
            form.current?.reset();
          }, 1000);
        },
        (error) => {
          console.error('EmailJS error:', error.text);
          setButtonText('Send Message');
        }
      );
  };

  return (
    <section data-aos="fade-up" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card padding="none" hoverable className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center gap-6 bg-pharmacy-deep p-10 text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <FontAwesomeIcon icon={faComments} className="h-7 w-7" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold">Contact Us</h2>
                <p className="mt-2 max-w-xs text-sm text-white/80">
                  Questions about an order or a medicine? Our pharmacists and support team
                  usually reply within one business day.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-white/90">
                {contactPoints.map((point) => (
                  <li key={point.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <FontAwesomeIcon icon={point.icon} className="h-3.5 w-3.5" />
                    </span>
                    {point.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 sm:p-10">
              <form ref={form} onSubmit={sendEmail} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-name">Your Name</Label>
                    <Input id="contact-name" required type="text" name="name" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Your Email</Label>
                    <Input id="contact-email" required type="email" name="email" placeholder="jane@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    required
                    name="message"
                    placeholder="Write your message here..."
                    className="h-36"
                  />
                </div>
                <Button
                  type="submit"
                  loading={buttonText === "Sending..."}
                  icon={<FontAwesomeIcon icon={faPaperPlane} />}
                  iconPosition="right"
                >
                  {buttonText}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactUs;
