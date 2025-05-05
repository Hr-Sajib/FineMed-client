import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPinned,
  Phone,
  Twitter,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#09192c] py-6">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* logo inner */}
          <div>
            {/* logo */}
            <Logo />
            {/* description */}
            <p className="text-white text-sm mt-6">
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
