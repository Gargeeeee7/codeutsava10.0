import {
  Skull,
  Ghost,
  Flame,
  Moon,
  Radio,
  Trophy,
  Code2,
  Bug,
  Gamepad2,
  ShieldAlert,
} from "lucide-react";

export const RITUALS = [
  { time: "31 Oct · 5:00 PM", title: "Check-In & Registration", desc: "Arrive at the venue. Collect your kit, find your team, and settle into the dark. ID verification and desk allocation happen here.", icon: Ghost },
  { time: "31 Oct · 6:30 PM", title: "Opening Ceremony", desc: "The Coven welcomes you. Keynote, rules briefing, and the first (and last) chance to ask questions before the lights go lower.", icon: Flame },
  { time: "31 Oct · 7:30 PM", title: "Problem Statements Drop", desc: "Themes are revealed. The 28-hour clock starts ticking. No going back into the woods now.", icon: Radio },
  { time: "31 Oct · 8:00 PM", title: "Hacking Begins", desc: "Laptops open. The first commits land. Mentors begin circulating for early guidance.", icon: Code2 },
  { time: "31 Oct · 11:00 PM", title: "Midnight Mentorship", desc: "First formal mentor round. Workshops and office hours open. Ask for help before something asks for yours.", icon: Moon },
  { time: "01 Nov · 2:00 AM", title: "The Witching Hour", desc: "Late-night energy checks, surprise mini-challenges, and more caffeine. The lights may flicker — that's just for effect. Probably.", icon: Bug },
  { time: "01 Nov · 8:00 AM", title: "Sunrise Checkpoint", desc: "Morning status update. Mentors return. Breakfast arrives. Keep shipping.", icon: Flame },
  { time: "01 Nov · 12:00 PM", title: "Final Stretch", desc: "Last mentor pass. Submission guidelines reconfirmed. Polish what you have — the deadline does not negotiate.", icon: ShieldAlert },
  { time: "01 Nov · 3:30 PM", title: "Submissions Close", desc: "Push your final commit. The 28-hour window seals shut. No late entries.", icon: Radio },
  { time: "01 Nov · 4:00 PM", title: "Demos & Judging", desc: "Live pitches begin. Judges walk the floor. Defend your work under the lights.", icon: Trophy },
  { time: "01 Nov · 7:00 PM", title: "Closing & Awards", desc: "Results, prizes, and the final ritual. Whoever survives the pitch round walks away crowned.", icon: Skull },
];

export const TRIALS = [
  { icon: Code2, title: "Haunted Web", desc: "Build interfaces so smooth they shouldn't exist. Full-stack, front-end, your choice of poison.", bounty: "₹25,000" },
  { icon: ShieldAlert, title: "The Breach", desc: "Cybersecurity & CTF. Find the crack in the wall before something crawls out of it.", bounty: "₹20,000" },
  { icon: Ghost, title: "Possessed Machines", desc: "AI/ML track. Teach a model to think — then hope it doesn't think for itself.", bounty: "₹25,000" },
  { icon: Gamepad2, title: "Afterlife Arcade", desc: "Game dev track. Build something playable, replayable, and just unsettling enough.", bounty: "₹15,000" },
];

export const COVEN = [
  { name: "Aarav Mehta", role: "Keeper of Chaos · Lead Organizer" },
  { name: "Ishita Rao", role: "Warden of Code · Tech Lead" },
  { name: "Devansh Kulkarni", role: "Ritual Master · Design Lead" },
  { name: "Sana Qureshi", role: "Keeper of the Purse · Sponsorships" },
  { name: "Rohan Verma", role: "Herald · Marketing Lead" },
  { name: "Meher Kapoor", role: "Gatekeeper · Logistics Lead" },
];

export const SPONSORS = [
  { tier: "Platinum Patron", name: "YOUR LOGO HERE" },
  { tier: "Gold Patron", name: "YOUR LOGO HERE" },
  { tier: "Gold Patron", name: "YOUR LOGO HERE" },
  { tier: "Silver Patron", name: "YOUR LOGO HERE" },
];

export const STATS = [
  { value: "1,200+", label: "Cursed Crews Have Dared to Enter" },
  { value: "28", label: "Hours in the Dark" },
  { value: "100+", label: "Colleges" },
  { value: "2,000+", label: "Digital Phantoms" },
];

export const TESTIMONIALS = [
  { quote: "I came for the free t-shirt. I left with a top-3 finish and a permanent flinch at flickering lights.", name: "Priya M.", role: "Haunted Web Track, '25" },
  { quote: "The 2 AM jump scare cost me a semicolon and about a year of my life. Worth it.", name: "Arjun T.", role: "The Breach Track, '25" },
  { quote: "Best 28 hours of my degree. Also the only 28 hours I've spent afraid of my own laptop.", name: "Neha S.", role: "Afterlife Arcade Track, '25" },
];

export const RULES = [
  "Teams of up to 4. No solo summoning unless pre-approved by the Coven.",
  "All code must be written during the event. Pre-written curses will be disqualified on sight.",
  "Thou shalt not plagiarize thy code, lest thy pull request be cursed for all eternity.",
  "Be excellent to your fellow coders. The Coven is always watching.",
  "If the WiFi dies, do not panic. Continue by candlelight — or hotspot, whichever is closer.",
];

export const FAQS = [
  { q: "Who can participate?", a: "Any student team, first year through final year, from any college. Outsiders are welcome to the ritual." },
  { q: "Is there a registration fee?", a: "None. Entry is free. Your sanity is the only currency required here." },
  { q: "What should I bring?", a: "Laptop, charger, a valid ID, and a reasonable tolerance for jump scares." },
  { q: "Can I register solo?", a: "Yes — solo entries are matched into a team during Check-In & Opening on Day 1." },
];

export const CASES = [
  {
    id: "CF-047",
    name: "SUBJECT #047",
    status: "MISSING",
    lastSeen: "03:17 AM — Sector 9",
    note: "Multiple reports of whispering near the old water tower. No physical remains recovered.",
  },
  {
    id: "CF-112",
    name: "SUBJECT #112",
    status: "UNACCOUNTED",
    lastSeen: "11:42 PM — Basement Level",
    note: "Personal effects found arranged in a perfect circle. Mirror covered from the inside.",
  },
  {
    id: "CF-203",
    name: "SUBJECT #203",
    status: "OPEN",
    lastSeen: "Unknown",
    note: "Case reopened after new audio surfaced. File contains 14 hours of static and one word.",
  },
  {
    id: "CF-009",
    name: "SUBJECT #009",
    status: "CLASSIFIED",
    lastSeen: "REDACTED",
    note: "Access restricted. Clearance level insufficient. Do not attempt further inquiry.",
  },
];