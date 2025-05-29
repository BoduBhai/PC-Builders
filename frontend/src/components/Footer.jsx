import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  YoutubeIcon,
  Mail,
  Phone,
  MapPin,
  Cpu,
  Monitor,
  HardDrive,
  Github,
  Linkedin,
  FacebookIcon,
  MailOpen,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 pt-4 pb-2 md:pt-10 md:pb-4">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2 mb-4 md:col-span-1 md:mb-0">
            <div className="mb-2 flex items-center md:mb-4">
              <Cpu className="text-primary mr-2" size={20} />
              <h2 className="text-xl font-bold md:text-2xl">PC Builders</h2>
            </div>
            <p className="mb-4 text-xs opacity-75 md:text-sm">
              Your one-stop shop for custom PC builds and high-quality
              components.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-4 md:mb-0">
            <h3 className="mb-2 text-sm font-bold md:mb-6 md:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs md:space-y-4 md:text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary flex items-center opacity-75 transition-colors"
                >
                  <Monitor size={16} className="mr-2" /> All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/build-pc"
                  className="hover:text-primary flex items-center opacity-75 transition-colors"
                >
                  <HardDrive size={16} className="mr-2" /> Build PC
                </Link>
              </li>
              <li>
                <Link
                  to="/products/pre-built-pc"
                  className="hover:text-primary flex items-center opacity-75 transition-colors"
                >
                  <Cpu size={16} className="mr-2" /> Pre-built
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary flex items-center opacity-75 transition-colors"
                >
                  <MailOpen size={16} className="mr-2" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="mb-4 md:mb-0">
            <h3 className="mb-2 text-sm font-bold md:mb-6 md:text-lg">
              Categories
            </h3>
            <ul className="space-y-2 text-xs md:space-y-4 md:text-sm">
              <li>
                <Link
                  to="/category/Processor"
                  className="hover:text-primary opacity-75 transition-colors"
                >
                  Processors
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Graphics Card"
                  className="hover:text-primary opacity-75 transition-colors"
                >
                  Graphics
                </Link>
              </li>
              <li>
                <Link
                  to="/category/RAM"
                  className="hover:text-primary opacity-75 transition-colors"
                >
                  Memory
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Case"
                  className="hover:text-primary opacity-75 transition-colors"
                >
                  Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 mt-2 md:col-span-1 md:mt-0">
            <h3 className="mb-2 text-sm font-bold md:mb-6 md:text-lg">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs md:space-y-4 md:text-sm">
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mt-1 mr-2 flex-shrink-0 opacity-75"
                />
                <span className="opacity-75">
                  123 PC Street, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0 opacity-75" />
                <span className="opacity-75">+880 1234-567890</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0 opacity-75" />
                <span className="opacity-75">support@pcbuilders.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-primary/80 mt-4 border-t pt-4 text-center md:mt-8 md:pt-4">
          <p className="text-md mb-2 tracking-wider md:text-lg">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/bodruddoza-araf-5989a22b7/"
              target="_blank"
              rel="noreferrer"
              className="text-violet-500 hover:underline"
            >
              Bodruddoza Araf
            </a>
            {"  "}
            <a
              href="https://github.com/BoduBhai/PC-Builders"
              target="_blank"
              rel="noreferrer"
            >
              <Github
                size="24"
                className="hover:text-primary inline opacity-75 transition-colors"
              />
            </a>
            <a
              href="https://www.facebook.com/bodruddoza.araf.2025/"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook
                size="24"
                className="hover:text-primary inline opacity-75 transition-colors"
              />
            </a>
            {"  "}
            <a
              href="https://www.linkedin.com/in/bodruddoza-araf-5989a22b7/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin
                size="24"
                className="hover:text-primary inline opacity-75 transition-colors"
              />
            </a>
            {"  "}
            <a
              href="https://www.instagram.com/_bodruddoza.araf_/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram
                size="24"
                className="hover:text-primary inline opacity-75 transition-colors"
              />
            </a>
          </p>
          <p className="text-xs opacity-50 md:text-sm">
            © {currentYear} PC Builders. All rights reserved.
          </p>
          <div className="mt-2 space-x-4 text-xs">
            <Link
              to="/privacy-policy"
              className="hover:text-primary opacity-75 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-primary opacity-75 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-primary opacity-75 transition-colors"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
