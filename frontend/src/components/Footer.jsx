import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Cpu,
  Monitor,
  HardDrive,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 pt-8 pb-4 md:pt-16 md:pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-2 mb-2 md:col-span-1 md:mb-0">
            <div className="mb-2 flex items-center md:mb-4">
              <Cpu className="text-primary mr-2" size={20} />
              <h2 className="text-xl font-bold md:text-2xl">PC Builders</h2>
            </div>
            <p className="text-base-content/80 mb-2 text-sm md:mb-4 md:text-base">
              Your one-stop shop for custom PC builds and high-quality
              components. Building dreams, one PC at a time.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-2 text-base font-bold md:mb-4 md:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-1 text-sm md:space-y-2 md:text-base">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary inline-flex items-center transition-colors"
                >
                  <Monitor size={14} className="mr-1 md:mr-2" /> All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/build-pc"
                  className="hover:text-primary inline-flex items-center transition-colors"
                >
                  <HardDrive size={14} className="mr-1 md:mr-2" /> Build Your PC
                </Link>
              </li>
              <li>
                <Link
                  to="/products/pre-built-pc"
                  className="hover:text-primary inline-flex items-center transition-colors"
                >
                  <Cpu size={14} className="mr-1 md:mr-2" /> Pre-built PCs
                </Link>
              </li>
              <li>
                <Link
                  to="/discounted-products"
                  className="hover:text-primary transition-colors"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-2 text-base font-bold md:mb-4 md:text-lg">
              Categories
            </h3>
            <ul className="space-y-1 text-sm md:space-y-2 md:text-base">
              <li>
                <Link
                  to="/category/Processor"
                  className="hover:text-primary transition-colors"
                >
                  Processors
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Graphics Card"
                  className="hover:text-primary transition-colors"
                >
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link
                  to="/category/RAM"
                  className="hover:text-primary transition-colors"
                >
                  Memory (RAM)
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Motherboard"
                  className="hover:text-primary transition-colors"
                >
                  Motherboards
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Case"
                  className="hover:text-primary transition-colors"
                >
                  PC Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 mt-2 md:col-span-1 md:mt-0">
            <h3 className="mb-2 text-base font-bold md:mb-4 md:text-lg">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm md:space-y-3 md:text-base">
              <li className="flex items-start">
                <MapPin size={16} className="mt-1 mr-1 flex-shrink-0 md:mr-2" />
                <span>123 PC Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-1 flex-shrink-0 md:mr-2" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-1 flex-shrink-0 md:mr-2" />
                <span>support@pcbuilders.com</span>
              </li>
            </ul>

            <div className="mt-3 md:mt-6">
              <h4 className="mb-1 text-sm font-semibold md:mb-2 md:text-base">
                Business Hours
              </h4>
              <p className="text-xs md:text-sm">
                Monday-Friday: 9AM - 8PM
                <br />
                Saturday: 10AM - 6PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-base-300 mt-4 border-t pt-3 text-center md:mt-6 md:pt-6">
          <p className="text-base-content/70 text-xs md:text-sm">
            © {currentYear} PC Builders. All rights reserved.
          </p>
          <div className="mt-1 space-x-2 text-xs md:mt-2 md:space-x-4">
            <Link
              to="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-primary transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
