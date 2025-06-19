"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: <Github size={24} />, url: "https://github.com", label: "GitHub" },
    {
      icon: <Linkedin size={24} />,
      url: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Twitter size={24} />,
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Instagram size={24} />,
      url: "https://instagram.com",
      label: "Instagram",
    },
  ];

  const contactInfo = [
    {
      icon: (
        <img src="/images/mail_icon.svg" alt="mail icon" className="w-6 h-6" />
      ),
      text: "Tanjildigital@gmail.com",
    },
    {
      icon: (
        <img src="/images/call_icon.svg" alt="call icon" className="w-6 h-6" />
      ),
      text: "+8801948873556",
    },
    {
      icon: (
        <img
          src="/images/location_icon.svg"
          alt="location icon"
          className="w-6 h-6"
        />
      ),
      text: "Dhaka, Bangladesh",
    },
  ];

  const footerLinks = [
    { title: "Home", href: "/" },
    { title: "Latest Works", href: "/latest-works" },
    { title: "Case Studies", href: "/case-studies" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <motion.footer
      className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 border-t border-gray-800"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gray-900 p-2 rounded-md">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Tanzil Hossain
                </h2>
              </div>
            </motion.div>
            <p className="mt-4 text-gray-400 max-w-xs">
              I&apos;m Tanzil Hossain, an AI-powered, data-driven digital
              marketer based worldwide, helping businesses grow online.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="text-white">{social.icon}</div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.2 }}
                >
                  <div className="text-purple-500 mt-0.5">{contact.icon}</div>
                  <span className="text-gray-400">{contact.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest updates on web development trends.
            </p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const email = form.elements.email.value;
                if (email) {
                  alert(`Subscribed with: ${email}`);
                  form.reset();
                }
              }}
            >
              <div className="relative">
                <input
                  id="footer-subscribe-email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="my-10 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Alex Bennett. All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Terms", "Privacy", "Cookies"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-500 hover:text-white text-sm transition-colors"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.5 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
    </motion.footer>
  );
};

export default Footer;
