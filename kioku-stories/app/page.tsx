"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCartStore } from "@/store/useCartStore";
import { Star, ArrowRight, ShoppingBag } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DYNAMIC_WORDS = ["Memories", "Moments", "Stories"];

const TESTIMONIALS = [
  { text: "The memory diary brought her to tears. It wasn't just a gift, it was a time capsule of our last three years together.", author: "Rahul & Priya", rating: 5 },
  { text: "Exquisite attention to detail! The romantic hamper was breathtaking and beautifully packaged.", author: "Aanya S.", rating: 5 },
  { text: "A truly personalized experience. The bespoke birthday gift made my best friend's day absolutely unforgettable.", author: "Vikram M.", rating: 5 }
];

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  const { openCart, items } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // States for dynamic UI
  const [isScrolled, setIsScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0); // Kept for logic if needed elsewhere, but animation is now GSAP
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isDarkNavbar, setIsDarkNavbar] = useState(false);

  // Dynamic Word Interval handled by GSAP timeline now

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Background Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    // Dynamic Word Animation
    const wordElements = gsap.utils.toArray(".dynamic-word");
    const dynamicTl = gsap.timeline({ repeat: -1 });

    wordElements.forEach((word: any, i) => {
      dynamicTl
        .to(word, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to(word, { opacity: 0, y: -20, duration: 0.8, ease: "power2.in", delay: 1.5 });
    });

    // Hero Entry Animation
    gsap.from(".hero-text", {
      y: 100,
      opacity: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2
    });

    // Hero Parallax on Scroll
    gsap.to(".hero-section > div", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Background Blobs Parallax
    gsap.to(".vibrant-blob-1", {
      yPercent: 50,
      xPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".vibrant-blob-2", {
      yPercent: -30,
      xPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Products Section Reveal
    gsap.from(".products-header", {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: ".products-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Staggered Product Card Reveal
    const cards = gsap.utils.toArray(".product-card");
    cards.forEach((card: any) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Testimonials Section Entrance
    gsap.from(".testimonial-section h3", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".testimonial-section .testimonial-content > .grid", {
      opacity: 0,
      y: 90,
      rotateX: -18,
      transformPerspective: 1200,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".testimonial-section .testimonial-content .flex.gap-1.mb-6, .testimonial-section .testimonial-content p, .testimonial-section .testimonial-content .flex.items-center.justify-center.gap-4", {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 65%",
        toggleActions: "play none none reverse"
      }
    });

    // Contact Section Entrance
    gsap.fromTo(
      ".contact-section",
      { opacity: 0.35 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 88%",
          end: "top 52%",
          scrub: true
        }
      }
    );

    gsap.from(".contact-badge, .contact-title, .contact-desc", {
      opacity: 0,
      x: -70,
      duration: 1,
      stagger: 0.16,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 82%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".contact-field", {
      opacity: 0,
      x: 60,
      y: 28,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 76%",
        toggleActions: "play none none reverse"
      }
    });

    // Background Color Transition (Target body/main and products section)
    const sections = [container.current, ".products-section", "footer"];
    gsap.to(sections, {
      backgroundColor: "#1a1a1a",
      ease: "none",
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      }
    });

    // Testimonial Reveal
    gsap.from(".testimonial-content", {
      opacity: 0,
      scale: 0.9,
      y: 50,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 70%",
      }
    });

    // Toggle navbar dark mode when crossing into the dark testimonial section
    ScrollTrigger.create({
      trigger: ".testimonial-section",
      start: "top 10%", // activates when the dark section is cleanly under the navbar
      onEnter: () => setIsDarkNavbar(true),
      onLeaveBack: () => setIsDarkNavbar(false)
    });

    setTimeout(() => ScrollTrigger.refresh(), 150);
  }, { scope: container });

  return (
    // STRICT OVERFLOW FIX: w-full max-w-[100vw] overflow-x-hidden
    <main ref={container} className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden w-full max-w-[100vw] bg-[#FAF9F6]">

      {/* Sticky & Transparent Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? isDarkNavbar 
            ? "bg-[#11100f]/60 backdrop-blur-xl py-4 border-b border-[#262422]/50" 
            : "bg-white/60 backdrop-blur-xl shadow-sm py-4" 
          : "bg-transparent py-6 lg:py-10"
      }`}>
        <nav className="grid grid-cols-[1fr_auto_1fr] items-center max-w-7xl mx-auto px-6 relative z-10 gap-4">
          <h1 className={`text-2xl tracking-[0.2em] font-medium cursor-pointer transition-colors duration-500 drop-shadow-sm ${isDarkNavbar ? "text-[#E5E3DB]" : "text-stone-800"}`}>
            KIOKU STORIES
          </h1>
          <button
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            className={`group hidden md:inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-all duration-500 ${isDarkNavbar ? "border-white/10 bg-white/10 text-[#F4F1E8] hover:bg-white/15 hover:border-white/20" : "border-stone-800/10 bg-white/70 text-stone-800 hover:bg-white hover:border-rose-300/70"}`}
          >
            <span className="relative">
              Products
              <span className="absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-rose-500 transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
          <button
            onClick={openCart}
            className={`justify-self-end group inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-500 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,15,15,0.08)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,15,15,0.14)] ${isDarkNavbar ? "border-white/10 bg-white/10 text-[#F4F1E8] hover:bg-white/15" : "border-stone-800/10 bg-white/55 text-stone-800 hover:bg-white/80"}`}
          >
            <ShoppingBag className={`h-4 w-4 transition-transform duration-500 group-hover:scale-110 ${isDarkNavbar ? "text-[#F4F1E8]" : "text-stone-700"}`} />
            <span className="hidden sm:inline">Open Cart</span>
            <span className="sm:hidden">Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold tracking-normal text-white shadow-md ring-2 ring-rose-300/40">
              {cartItemCount}
            </span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative pt-24 pb-16">

        {/* Background Blobs */}
        <div className="vibrant-blob vibrant-blob-1 absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-rose-200/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="vibrant-blob vibrant-blob-2 absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] bg-orange-100/60 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 hero-text tracking-tight text-stone-900 leading-[1.1]">
            <span className="font-sans">Tangible</span> <br />

            {/* Dynamic Text Wrapper */}
            <span className="font-serif italic text-rose-500 pr-2 relative inline-block min-w-[280px] md:min-w-[400px] text-center">
              {DYNAMIC_WORDS.map((word) => (
                <span
                  key={word}
                  className="dynamic-word absolute left-0 w-full opacity-0 translate-y-10"
                >
                  {word}
                </span>
              ))}
              {/* Invisible placeholder to maintain layout width */}
              <span className="opacity-0">Memories</span>
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-rose-200/50 rounded-full"></span>
            </span>
            <br />
            <span className="font-sans">Crafted for</span> <span className="font-serif italic text-stone-800 pr-2">You.</span>
          </h2>

          <p className="text-xl md:text-2xl lg:text-3xl text-stone-600 mb-10 hero-text max-w-4xl mx-auto leading-relaxed font-light">
            <span className="font-serif italic text-stone-800">Bespoke</span> romantic hampers, <span className="font-serif italic text-stone-800">personalized</span> birthday gifts, and <span className="font-serif italic text-stone-800">handcrafted</span> memory diaries designed to tell your <span className="text-rose-500 font-medium">unique story.</span>
          </p>

          <div className="hero-text relative inline-block p-2">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="relative overflow-hidden group bg-stone-900 text-[#FAF9F6] px-12 py-6 rounded-full text-sm uppercase tracking-[0.2em] font-medium transition-all shadow-xl"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Start Your Story</span>
              <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 rounded-full"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Products Section (With Images) */}
      <section id="products" className="products-section w-full py-32 bg-white relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="products-header flex flex-col items-center mb-20">
            <span className="text-xs uppercase tracking-[0.2em] text-rose-500 mb-4 block font-semibold">Our Collection</span>
            <h3 className="text-4xl md:text-5xl font-serif italic text-stone-800 flex gap-3">
              <span>Curated</span>
              <span className="text-rose-500 animate-typing">Offerings</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Product Card 1 */}
            <div className="product-card group p-6 rounded-[2rem] bg-[#FAF9F6] flex flex-col justify-between h-full">
              <div>
                <div className="relative w-full h-80 mb-8 overflow-hidden rounded-2xl bg-stone-200">
                  <Image
                    src="/images/img1.jpg" // Add your image to public/images/
                    alt="Romantic Hamper"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-2xl mb-3 font-medium text-stone-800">Romantic Hamper</h4>
                <p className="text-stone-600 text-sm leading-relaxed mb-8">Artisan chocolates, handwritten letters, and polaroids tailored to your love story.</p>
              </div>
              <button
                onClick={() => useCartStore.getState().addItem({ id: '1', name: 'Romantic Hamper', price: 120 })}
                className="group/btn relative overflow-hidden self-start flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-stone-700 py-3 px-6 rounded-full transition-all duration-300 border border-stone-300 hover:border-rose-500 hover:text-white uppercase"
              >
                <div className="absolute inset-0 bg-rose-500 origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10">Add to Cart — $120</span>
                <ArrowRight className="w-4 h-4 relative z-10 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Product Card 2 */}
            <div className="product-card group p-6 rounded-[2rem] bg-[#FAF9F6] flex flex-col justify-between h-full">
              <div>
                <div className="relative w-full h-80 mb-8 overflow-hidden rounded-2xl bg-stone-200">
                  <Image
                    src="/images/img2.jpg"
                    alt="Birthday Hamper"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-2xl mb-3 font-medium text-stone-800">Birthday Hamper</h4>
                <p className="text-stone-600 text-sm leading-relaxed mb-8">Joyful, bespoke bundles carefully tailored to their unique personality.</p>
              </div>
              <button
                onClick={() => useCartStore.getState().addItem({ id: '2', name: 'Birthday Hamper', price: 95 })}
                className="group/btn relative overflow-hidden self-start flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-stone-700 py-3 px-6 rounded-full transition-all duration-300 border border-stone-300 hover:border-rose-500 hover:text-white uppercase"
              >
                <div className="absolute inset-0 bg-rose-500 origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10">Add to Cart — $95</span>
                <ArrowRight className="w-4 h-4 relative z-10 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Product Card 3 */}
            <div className="product-card group p-6 rounded-[2rem] bg-[#FAF9F6] flex flex-col justify-between h-full">
              <div>
                <div className="relative w-full h-80 mb-8 overflow-hidden rounded-2xl bg-stone-200">
                  <Image
                    src="/images/img3.jpg"
                    alt="Memory Diary"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-2xl mb-3 font-medium text-stone-800">Memory Diary</h4>
                <p className="text-stone-600 text-sm leading-relaxed mb-8">Hand-bound premium leather books crafted to safely store your precious kioku.</p>
              </div>
              <button
                onClick={() => useCartStore.getState().addItem({ id: '3', name: 'Memory Diary', price: 65 })}
                className="group/btn relative overflow-hidden self-start flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-stone-700 py-3 px-6 rounded-full transition-all duration-300 border border-stone-300 hover:border-rose-500 hover:text-white uppercase"
              >
                <div className="absolute inset-0 bg-rose-500 origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10">Add to Cart — $65</span>
                <ArrowRight className="w-4 h-4 relative z-10 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          <div className="mt-16 flex justify-center">
            <button
              className="group inline-flex items-center gap-3 rounded-full border border-stone-800/15 bg-white/80 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-800 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-white"
            >
              View More
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section w-full py-32 px-6 text-stone-100 text-center relative overflow-hidden">
        <div className="testimonial-content max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-10 font-semibold">Stories from our clients</h3>
          
          <div className="grid w-full items-center justify-center relative" style={{ perspective: "1200px" }}>
            {TESTIMONIALS.map((testimonial, idx) => {
              const isActive = activeTestimonial === idx;
              const isPrev = idx === (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
              
              // Decide position relative to active element
              let position = "next"; // Coming from right
              if (isActive) position = "active";
              else if (isPrev) position = "prev"; // Going to left

              return (
                <div 
                  key={idx} 
                  className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 10 : 0,
                    transform: isActive 
                      ? "rotateY(0deg) translateZ(0px) translateX(0%) scale(1)" 
                      : position === "prev"
                        ? "rotateY(60deg) translateZ(-200px) translateX(-50%) scale(0.8)"  // Rotates out left
                        : "rotateY(-60deg) translateZ(-200px) translateX(50%) scale(0.8)", // Entering from right
                  }}
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-rose-400 text-rose-400' : 'text-stone-600'}`} />
                    ))}
                  </div>
                  <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic leading-[1.4] mb-8 text-stone-200 px-4">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-[1px] bg-rose-400/50" />
                    <p className="text-sm uppercase tracking-widest text-rose-300 font-medium">{testimonial.author}</p>
                    <div className="w-10 h-[1px] bg-rose-400/50" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section w-full py-32 md:py-40 px-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 relative z-10">
          
          {/* Left Column */}
          <div className="contact-copy w-full lg:w-[45%] flex flex-col items-start pr-0 lg:pr-10">
            <div className="contact-badge border border-stone-700 text-stone-300 text-[10px] uppercase tracking-[0.25em] px-5 py-2.5 rounded-full mb-16 flex items-center gap-3 w-max">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span> CONTACT
            </div>
            
            <h2 className="contact-title text-6xl md:text-[5.5rem] font-serif text-stone-200 leading-[1.05] tracking-tight mb-12">
              Feel Free To <br />
              <span className="inline-block mt-2">Keep</span> <br />
              <span className="italic text-rose-400 font-light inline-block mt-2">In Touch With</span> <br />
              <span className="italic text-rose-400 font-light inline-block mt-2">Us</span>
            </h2>
            
            <p className="contact-desc text-stone-400 text-sm leading-[1.8] max-w-sm font-light mt-4">
              Find the perfect bespoke gifts tailored to your needs. Get in touch with us for expert advice and premium handcrafted products.
            </p>
          </div>

          {/* Right Column / Form Container */}
          <div className="contact-form w-full lg:w-[55%] flex flex-col pt-4">
            <div className="w-full flex flex-col divide-y divide-stone-800/80 hover:divide-stone-700/80 transition-colors duration-500">
              {['YOUR NAME', 'YOUR EMAIL', 'YOUR PHONE', 'SUBJECT', 'MESSAGE'].map((field, i) => (
                <div key={field} className={`contact-field group flex flex-col relative py-8 transition-colors duration-500 hover:bg-stone-900/20 ${i === 0 ? 'pt-0' : ''} ${i === 4 ? 'pb-0 border-b border-stone-800/80' : ''}`}>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 transition-colors duration-300 group-hover:text-rose-300 group-focus-within:text-rose-400">
                    {field}
                  </label>
                  {field === 'MESSAGE' ? (
                    <textarea 
                      className="w-full bg-transparent border-none outline-none text-stone-200 transition-colors duration-500 resize-none h-10 text-sm font-light placeholder:text-stone-700 group-hover:placeholder:text-stone-500"
                      placeholder="——"
                    ></textarea>
                  ) : (
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-none outline-none text-stone-200 transition-colors duration-500 text-sm font-light placeholder:text-stone-700 group-hover:placeholder:text-stone-500"
                      placeholder="——"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center bg-transparent border-t border-stone-800/10">
        <p className="text-stone-400 text-xs uppercase tracking-[0.1em]">
          © {new Date().getFullYear()} Kioku Stories. All rights reserved.
        </p>
      </footer>
    </main>
  );
}