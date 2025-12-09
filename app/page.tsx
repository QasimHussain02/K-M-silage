"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Star,
  Truck,
  Leaf,
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    quantity: "",
    message: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Feature cards data
  const features = [
    {
      icon: Leaf,
      title: "Nutrient-Rich",
      description:
        "Premium quality silage with optimal nutritional composition for maximum livestock productivity.",
    },
    {
      icon: MapPin,
      title: "Locally Sourced",
      description:
        "Sourced from trusted local farms within our region for freshness and traceability.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description:
        "Rigorous testing and quality control ensures every bale meets our high standards.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery to your farm with flexible scheduling options.",
    },
  ];

  // Products data
  const products = [
    {
      name: "Corn Silage",
      specs: "Moisture: 65-70% | Bale: 4x4 ft",
      image:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop",
    },
    {
      name: "Grass Silage",
      specs: "Moisture: 50-55% | Bale: 4x4 ft",
      image:
        "https://images.unsplash.com/photo-1599595405074-5aceb9106c5f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Alfalfa Silage",
      specs: "Moisture: 45-50% | Bale: 4x4 ft",
      image:
        "https://images.unsplash.com/photo-1756156977359-a03f5786ef67?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Mixed Silage",
      specs: "Moisture: 55-65% | Bale: 4x4 ft",
      image:
        "https://images.unsplash.com/photo-1600107294669-320f67e02741?q=80&w=966&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // Steps data
  const steps = [
    {
      number: "1",
      title: "Place Your Order",
      description:
        "Choose your silage type, quantity, and delivery date. Get a free quote instantly.",
    },
    {
      number: "2",
      title: "Quick Delivery",
      description:
        "We deliver fresh silage directly to your farm within 48 hours of confirmation.",
    },
    {
      number: "3",
      title: "Happy Livestock",
      description:
        "Feed premium silage to your cattle and notice improved health and productivity.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote:
        "KM Silage has transformed our feeding program. Our cattle are healthier and more productive than ever before.",
      author: "John Anderson",
      farm: "Anderson Dairy Farm",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      quote:
        "Reliable delivery, consistent quality, and outstanding customer service. Highly recommended!",
      author: "Sarah Mitchell",
      farm: "Green Valley Ranch",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      quote:
        "The nutrient-rich silage has reduced our feed costs while improving animal performance.",
      author: "Michael Roberts",
      farm: "Roberts Livestock Co.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAVIGATION ===== */}

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-12 md:pt-20 pb-12 md:pb-24"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-48 -mb-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Premium Silage for{" "}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    Healthier Livestock
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nutrient-rich, quality-assured silage sourced from local
                  farms. Feed your cattle the best, watch them thrive with
                  improved health and productivity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Get a Free Quote</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-all duration-200">
                  Learn More
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  Trusted by 500+ farms
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 md:h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1658666082952-6a112f014a38?q=80&w=895&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Premium silage bales in a field"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section id="about" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Why Choose KM Silage?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Were committed to providing the highest quality silage with
              exceptional service and competitive pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-green-50/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section
        id="products"
        className="py-20 md:py-32 bg-gradient-to-br from-green-50/50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our premium selection of silage varieties, each
              expertly prepared for optimal nutrition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="group rounded-xl overflow-hidden border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.specs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to get premium silage delivered to your farm.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Step Number */}
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-linear-to-r from-green-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-32 bg-linear-to-br from-green-50/50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              What Farmers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real testimonials from our satisfied customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-white border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 space-y-6"
              >
                {/* Quote */}
                <p className="text-gray-700 leading-relaxed italic">
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.farm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">KM</span>
                </div>
                <span className="font-bold text-white">KM Silage</span>
              </div>
              <p className="text-sm">
                Premium silage for healthier livestock and sustainable farming.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#home"
                    className="hover:text-green-400 transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#products"
                    className="hover:text-green-400 transition"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-green-400 transition"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="hover:text-green-400 transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-green-400 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400 transition">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <button
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-green-600 flex items-center justify-center transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-green-600 flex items-center justify-center transition"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-green-600 flex items-center justify-center transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-green-600 flex items-center justify-center transition"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="font-semibold text-white mb-3 text-sm">
                  Newsletter
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>
              &copy; 2025 KM Silage. All rights reserved. | Providing premium
              silage to farmers nationwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
