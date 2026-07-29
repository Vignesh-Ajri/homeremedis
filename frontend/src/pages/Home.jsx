import React, { useRef } from "react";
import {
  Leaf,
  Droplet,
  Flower2,
  Sprout,
  Sparkles,
  TreeDeciduous,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Wind,
  Moon,
  ShieldCheck,
  Flame,
  Zap,
} from "lucide-react";
import { Link } from 'react-router';

const plants = [
  { name: "Ginger", icon: Sprout, tint: "bg-amber-100", ring: "ring-amber-200", ic: "text-amber-700", rot: "rotate-3", blurb: "Eases nausea and supports healthy digestion." },
  { name: "Aloe Vera", icon: Droplet, tint: "bg-emerald-100", ring: "ring-emerald-200", ic: "text-emerald-700", rot: "-rotate-2", blurb: "Cools and soothes irritated or sun-exposed skin." },
  { name: "Tulsi", icon: Leaf, tint: "bg-lime-100", ring: "ring-lime-200", ic: "text-lime-700", rot: "-rotate-3", blurb: "A daily tonic traditionally used to support immunity and calm." },
  { name: "Honey", icon: Sparkles, tint: "bg-orange-100", ring: "ring-orange-200", ic: "text-orange-700", rot: "rotate-2", blurb: "Soothes a sore throat and sweetens remedies naturally." },
  { name: "Herbal Blends", icon: Flower2, tint: "bg-stone-100", ring: "ring-stone-200", ic: "text-stone-700", rot: "rotate-6", blurb: "Curated mixes for sleep, focus, and everyday balance." },
  { name: "Neem", icon: TreeDeciduous, tint: "bg-teal-100", ring: "ring-teal-200", ic: "text-teal-700", rot: "-rotate-6", blurb: "A bitter leaf long used for clear skin and detox rituals." },
  { name: "Ashwagandha", icon: Moon, tint: "bg-violet-100", ring: "ring-violet-200", ic: "text-violet-700", rot: "rotate-2", blurb: "An adaptogenic root that helps the body handle daily stress." },
  { name: "Turmeric", icon: Flame, tint: "bg-yellow-100", ring: "ring-yellow-200", ic: "text-yellow-700", rot: "-rotate-2", blurb: "A golden root prized for its calming, anti-inflammatory properties." },
];

// first 6 plants power the hero mosaic; all 8 power the carousel below
const tiles = plants.slice(0, 6);

const concerns = [
  { label: "Stress Relief", icon: Wind, tint: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  { label: "Better Sleep", icon: Moon, tint: "border-violet-200 bg-violet-50 text-violet-800" },
  { label: "Immunity Boost", icon: ShieldCheck, tint: "border-amber-200 bg-amber-50 text-amber-800" },
  { label: "Digestion", icon: Flame, tint: "border-orange-200 bg-orange-50 text-orange-800" },
  { label: "Skin & Hair", icon: Droplet, tint: "border-teal-200 bg-teal-50 text-teal-800" },
  { label: "Energy & Focus", icon: Zap, tint: "border-lime-200 bg-lime-50 text-lime-800" },
];

export default function Home() {
  const scrollerRef = useRef(null);

  const scrollByAmount = (amount) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-stone-50 text-stone-800"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >


      {/* ambient background */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200 opacity-30 blur-3xl"></div>
        <div className="pointer-events-none absolute top-40 right-0 h-96 w-96 rounded-full bg-amber-200 opacity-30 blur-3xl"></div>



        {/* HERO */}
        <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-8 md:grid-cols-2">
          {/* left: copy + CTAs */}
          <div>
            <h1
              className="mt-6 text-5xl leading-tight text-stone-900 md:text-6xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Everyday wellness,
              <br />
              straight from nature.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-600">
              Discover the plants and remedies people have trusted for
              generations — explained simply, so you can bring a little more
              nature into your daily routine.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/plants"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-3.5 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-900"
              >
                Browse Plants
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/remedies"
                className="inline-flex items-center gap-2 rounded-full border-2 border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400"
              >
                Remedies
              </Link>
            </div>

            <div className="mt-12 flex gap-10 text-stone-500">
              <div>
                <p className="text-2xl font-semibold text-stone-900" style={{ fontFamily: "'Fraunces', serif" }}>50+</p>
                <p className="text-xs uppercase tracking-wide">Plants covered</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900" style={{ fontFamily: "'Fraunces', serif" }}>120+</p>
                <p className="text-xs uppercase tracking-wide">Simple remedies</p>
              </div>
            </div>
          </div>

          {/* right: mosaic of 6 tiles */}
          <div id="plants" className="grid grid-cols-3 gap-4 sm:gap-5">
            {tiles.map(({ name, icon: Icon, tint, ring, ic, rot }) => (
              <div
                key={name}
                className={`group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl ${tint} ring-1 ${ring} ${rot} p-3 text-center shadow-sm transition duration-300 hover:rotate-0 hover:shadow-md`}
              >
                <Icon className={`h-7 w-7 ${ic}`} strokeWidth={1.75} />
                <span className="text-xs font-semibold text-stone-700 sm:text-sm">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* BROWSE BY CONCERN */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Browse by concern
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {concerns.map(({ label, icon: Icon, tint }) => (
            <Link
              key={label}
              to="/remedies"
              className={`inline-flex items-center gap-2 rounded-full border ${tint} px-4 py-2 text-sm font-medium transition hover:opacity-80`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PLANTS CAROUSEL */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Featured plants
            </span>
            <h2
              className="mt-3 text-3xl text-stone-900 md:text-4xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Start with these staples
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollByAmount(-320)}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollByAmount(320)}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-5 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {plants.map(({ name, icon: Icon, tint, ring, ic, blurb }) => (
            <div
              key={name}
              className={`flex w-64 shrink-0 flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md`}
              style={{ scrollSnapAlign: "start" }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tint} ring-1 ${ring}`}>
                <Icon className={`h-6 w-6 ${ic}`} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-stone-900">{name}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{blurb}</p>
              <Link
                to="/remedies"
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:underline"
              >
                See remedies
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / MOTIVE */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Our motive
            </span>
            <h2
              className="mt-4 text-3xl text-stone-900 md:text-4xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Why Nature's Cure exists
            </h2>
            <p className="mt-5 leading-relaxed text-stone-600">
              We believe good health often starts with what's already growing
              around us. Nature's Cure gathers trusted, natural remedies and
              simple wellness habits into one place — no jargon, no
              overwhelm, just practical guidance rooted in nature.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              Whether you're after stress relief, an immunity boost, or a
              gentler everyday routine, our guides help you make small,
              sustainable changes using ingredients nature already provides.
            </p>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-700" />
            <div>
              <h3 className="font-semibold text-stone-900">
                A quick note before you begin
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Content on this site is educational and not a substitute for
                professional medical advice. Please consult a qualified
                healthcare provider before trying a new remedy — especially
                if you're pregnant, nursing, or managing a health condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER / DEVELOPER DETAILS */}
      <footer id="footer" className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800">
                <Leaf className="h-4 w-4 text-emerald-50" />
              </div>
              <span
                className="text-base font-semibold text-stone-900"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Nature's Cure
              </span>
            </div>

            <p className="text-sm text-stone-500">
              &copy; 2026 Nature's Cure. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
             
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-stone-400 md:text-left">
            Designed &amp; developed by{" "}
            <span className="font-medium text-stone-600">Vignesh</span> —
            replace with your details.
          </p>
        </div>
      </footer>
    </div>
  );
}