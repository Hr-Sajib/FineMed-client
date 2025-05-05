import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPinned,
  Phone,
  Twitter,
} from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-[#09192c] py-6">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* logo inner */}
          <div>
            {/* logo */}
            <Link href="/" className="flex items-center space-x-2">
            <svg
              className="h-8 w-8 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <span className="font-bold text-xl text-teal-600"><span className="text-gray-100">Fine</span>Med</span>

          </Link>
            {/* description */}
            <p className="text-white text-sm mt-6 lg:w-[60%]">
              FineMed is your trusted online medicine and healthcare shop,
              offering a wide range of genuine medicines, health products, and
              wellness essentials — delivered safely to your doorstep.
            </p>
          </div>
          {/* quick link inner */}
          <div>
            <h3 className="text-white text-3xl font-semibold mb-6 ">
              Quick Links
            </h3>
            <ul className="text-white leading-8">
              <li className="hover:underline transition ease-in-out">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:underline transition ease-in-out">
                <Link href="/shop">Shop</Link>
              </li>
              <li className="hover:underline transition ease-in-out">
                <Link href="/cart">Cart</Link>
              </li>
              <li className="hover:underline">
                <Link href="/checkout">Checkout</Link>
              </li>
              <li className="hover:underline transition ease-in-out">
                <Link href="/orders">Orders</Link>
              </li>
            </ul>
          </div>
          {/* contact inner and social inner */}
          <div>
            <h3 className="text-white font-semibold text-3xl mb-6">
              Contact Us
            </h3>
            <ul className="text-white leading-8">
              <li className="flex items-center gap-4 mb-4">
                <Phone />
                <span>+1 (415) 555-0198</span>
              </li>
              <li className="flex items-center gap-4 mb-4">
                <Mail />
                <span>support@FineMed.com</span>
              </li>
              <li className="flex items-center gap-4 mb-4">
                <MapPinned />
                <span>
                  FineMed Support Center 742 Evergreen Terrace Springfield, IL
                  62704 United States
                </span>
              </li>
              <li className="flex gap-4">
                <Link href="https://www.facebook.com/" className=" hover:text-teal-500">
                  <Facebook />
                </Link >
                <Link href="https://www.instagram.com/" className=" hover:text-teal-500">
                  <Instagram />
                </Link>
                <Link href="https://x.com/?lang=en" className=" hover:text-teal-500">
                  <Twitter />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="border-t-2 border-white"/>
      {/* All rights reserved */}
      <div className="mt-6">
        <p className="text-white text-center">
          &copy; 2025 FineMed. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
