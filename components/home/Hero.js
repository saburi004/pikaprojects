/* eslint-disable */

"use client";
import React, { useState, useRef, useEffect } from "react";
import DotGrid from "./DotGrid";
import Link from "next/link";
import Image from "next/image";
import "animate.css";
import Head from "next/head";
import NewlyAdded from "./NewlyAdded";
import Startselling from "./Startselling"
import {
  ChevronDown,
  ChevronUp,
  Star,
  Trophy,
  Users,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Footer from "../Footer";

// GLTF/GLB Model Component
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Pokeball3D({ mousePosition }) {
  const meshRef = useRef();
  const scale = 2;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = mousePosition.x * 0.2;
      meshRef.current.rotation.x = mousePosition.y * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <Model url="/models/pokeball.glb" />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

// Floating Pokemon Icons Component
const FloatingPokemon = ({ pokemonIcons = [] }) => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const generated = pokemonIcons.map((_, index) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${index * 0.5}s`,
      animationDuration: `${2 + Math.random() * 20}s`,
    }));
    setPositions(generated);
  }, []); // <-- run ONLY once on mount (important!)

  if (positions.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pokemonIcons.map((icon, index) => (
        <div
          key={index}
          className="absolute text-2xl animate-bounce opacity-20"
          style={{
            left: positions[index].left,
            top: positions[index].top,
            animationDelay: positions[index].animationDelay,
            animationDuration: positions[index].animationDuration,
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  );
};

// Stats Counter Component
const StatsCounter = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < number) {
            return prev + Math.ceil(number / 50);
          }
          return number;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isVisible, number]);

  return (
    <div
      ref={ref}
      className="group text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-500"></div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 to-red-400/0 group-hover:from-yellow-400/20 group-hover:to-red-400/20 transition-all duration-500"></div>

      <div className="relative z-10">
        <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
          {icon}
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors duration-300">
          {count.toLocaleString()}+
        </div>
        <div className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
          {label}
        </div>
      </div>
    </div>
  );
};

// Pokemon Element Badge Component
const ElementBadge = ({ element, color, emoji }) => (
  <div
    className={`group flex items-center gap-2 ${color} px-4 py-2 rounded-full text-black font-semibold text-sm hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-lg relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 rounded-full"></div>
    <span className="text-lg group-hover:animate-bounce relative z-10">
      {emoji}
    </span>
    <span className="relative z-10 group-hover:font-bold transition-all duration-300">
      {element}
    </span>
  </div>
);

const Hero = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const faqs = [
    {
      id: 1,
      question: "What types of projects do you offer?",
      answer:
        "We offer a wide variety of projects including Web Development, Mobile Apps, AI/ML solutions, E-commerce platforms, and custom software development. Each project is crafted with care and attention to detail.",
    },
    {
      id: 2,
      question: "How do I purchase a project?",
      answer:
        "Simply browse our project gallery, select the one that fits your needs, and follow our secure checkout process. You'll receive all source code, documentation, and support materials instantly.",
    },
    {
      id: 3,
      question: "Do you provide post-purchase support?",
      answer:
        "Yes! We provide comprehensive support including documentation, setup guides, and technical assistance to help you implement and customize your project successfully.",
    },
    {
      id: 4,
      question: "Can projects be customized?",
      answer:
        "Absolutely! Most of our projects come with detailed documentation and are designed to be easily customizable. We also offer custom development services for specific requirements.",
    },
    {
      id: 5,
      question: "What technologies do you use?",
      answer:
        "We work with modern technologies including React, Next.js, Python, Node.js, AI/ML frameworks, and many more. Each project uses industry-standard best practices and cutting-edge tools.",
    },
  ];

  const whyChooseUsItems = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Premium Quality",
      description:
        "All our projects are built with industry-standard practices and thoroughly tested",
      color: "bg-yellow-400",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Get your project instantly after purchase with immediate download access",
      color: "bg-orange-400",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description:
        "100% secure transactions with lifetime access to your purchased projects",
      color: "bg-red-400",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description:
        "Join our thriving community of developers and get help when you need it",
      color: "bg-blue-400",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Ready to Deploy",
      description:
        "All projects come production-ready with deployment guides and documentation",
      color: "bg-green-400",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Regular Updates",
      description:
        "Get free updates and improvements to keep your projects current",
      color: "bg-purple-400",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;

        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleMouseEnter = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10);
  };

  return (
    <>
      <div>
      </div>

      {/* Hero Section with Enhanced Background */}
      <div className="relative w-full h-[300px] md:h-[700px] overflow-hidden bg-yellow text-white">
        <FloatingPokemon />

        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
          className="bg-yellow"
        >
          <DotGrid
            dotSize={2}
            gap={73}
            baseColor="#EEFF00"
            activeColor="#FA0000"
            proximity={500}
            shockRadius={360}
            shockStrength={20}
            resistance={500}
            returnDuration={2.6}
            className="bg-yellow"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-10">
          <div className="text-center md:text-left z-10 mt-8 md:mt-0">
            <h1
              className="text-3xl sm:text-4xl md:text-7xl font-bold z-6 "
              style={{ fontFamily: "pikachuBold" }}
            >
              Welcome to PikaProjects
            </h1>
            <p
              className="text-base md:text-4xl mt-12 md:mt-12"
              style={{ fontFamily: "pikachuNormal" }}
            >
              Claim your project now..! ⚡
            </p>

            {/* Pokemon Elements */}
            <div className="flex flex-wrap gap-2 mt-12 justify-center md:justify-start">
              <ElementBadge element="Web Dev" color="bg-green-400" emoji="🌿" />
              <ElementBadge element="AI/ML" color="bg-blue-400" emoji="💧" />
              <ElementBadge element="Mobile" color="bg-red-400" emoji="🔥" />
            </div>
          </div>

          <div
            className={`relative h-48 w-48 md:h-[460px] md:w-[460px] mt-12 md:mt-60 ${isAnimating ? "animate__animated animate__bounceInUp" : ""
              }`}
            onMouseEnter={handleMouseEnter}
          >
            <img
              src="https://www.reef2reef.com/attachments/e9eho5l-gif.880287/"
              alt="Pikachu"
              fill="true"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}

      <div className="min-h-screen bg-[#E5FFFE]">
        <Head>
          <title>Pokemon Cards Section</title>
          <style>{`
            .parallax {
              background-attachment: fixed;
              background-position: center;
              background-repeat: no-repeat;
              background-size: contain;
            }
          `}</style>
        </Head>

        {/* <div className="flex justify-center py-4">
          <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rounded-full animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div> */}

        <NewlyAdded />

        {/* Enhanced Buy/Sell Section */}
        <div className="relative h-64 sm:h-80 md:h-96 max-w-full mx-auto overflow-hidden">
          <img
            src="/assets/BuySellBg.png"
            alt="Background"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full object-cover object-center z-0"
          />

          {/* Pokeball decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full opacity-50 animate-pulse"></div>
          <div
            className="absolute top-8 right-8 w-6 h-6 bg-yellow-400 rounded-full opacity-50 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="relative z-10 flex h-full max-w-[1000px] mx-auto gap-x-4 sm:gap-x-8 md:gap-x-12 px-4">
            <Link href="/marketplace" className="w-1/2 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <div className="text-center cursor-pointer">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-2">
                  Buy
                </h2>
                <p className="text-sm text-yellow-300">Premium Projects</p>
              </div>
            </Link>
            <Link href="/dashboard" className="w-1/2 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <div className="text-center cursor-pointer">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                  Sell
                </h2>
                <p className="text-sm text-gray-700">Your Creations</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-gradient-to-br from-[#E5FFFE] to-[#B3F5FF]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "pikachuBold" }}
              >
                Why Choose PikaProjects? ⚡
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of developers who trust us for their project
                needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUsItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-100 hover:border-yellow-400 relative overflow-hidden cursor-pointer"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-orange-400/0 group-hover:from-yellow-400/10 group-hover:to-orange-400/10 transition-all duration-500"></div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced FAQ section */}
        <div className="min-h-[70vh] bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200 p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Pokemon Silhouettes Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl">🔥</div>
            <div className="absolute top-20 right-20 text-4xl">⚡</div>
            <div className="absolute bottom-20 left-20 text-5xl">💧</div>
            <div className="absolute bottom-10 right-10 text-3xl">🌿</div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              {/* Left side - GLB Pokéball */}
              {!isMobile && (
                <div
                  className="flex justify-center items-center h-[300px] w-full lg:w-1/2"
                  ref={containerRef}
                >
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight
                      position={[10, 10, 10]}
                      angle={0.15}
                      penumbra={1}
                    />
                    <pointLight position={[-10, -10, -10]} />
                    <Pokeball3D mousePosition={mousePosition} />
                    <OrbitControls enableZoom={false} />
                  </Canvas>
                </div>
              )}

              {/* Right side - FAQ Section */}
              <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                <div className="text-center lg:text-left mb-6 sm:mb-8">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "pikachuBold" }}
                  >
                    FAQ's ❓
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-700">
                    Everything you need to know about our projects
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-4 py-3 sm:px-6 sm:py-4 text-left flex justify-between items-center bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
                      >
                        <span className="font-semibold text-sm sm:text-base md:text-lg">
                          {faq.question}
                        </span>
                        <div className="transition-transform duration-300">
                          {openFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openFAQ === faq.id
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <Startselling />
        {/* <div className="bg-[#E5FFFE] py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
            <div
              className="absolute top-32 right-20 w-16 h-16 bg-red-400/20 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-32 right-1/3 w-24 h-24 bg-green-400/20 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "pikachuBold" }}
            >
              Ready to Start Your Journey? 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of developers who've already chosen PikaProjects
              for their success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Browse Projects ⚡
                </span>
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
              </button>
              <button className="group relative border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Start Selling 💪
                </span>
              </button>
            </div>
          </div>
        </div> */}
      </div>
      <div
        className="bg-gradient-to-b from-yellow-400 to-yellow-400 py-12
"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatsCounter number={500} label="Projects Sold" icon="🏆" />
            <StatsCounter number={1200} label="Happy Clients" icon="😊" />
            <StatsCounter number={50} label="Technologies" icon="⚡" />
            <StatsCounter number={99} label="Success Rate %" icon="🎯" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hero;
