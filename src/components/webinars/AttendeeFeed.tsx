import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Users } from "lucide-react";

const names = [
  "Ahmed", "Rahul", "Maria", "John", "Sarah", "Ali", "Wei", "Elena", "David", "Fatima",
  "Hiroshi", "Priya", "Carlos", "Sofia", "Liam", "Yuki", "Omar", "Isabella", "Chen", "Lucas"
];

const locations = [
  "Dubai", "Mumbai", "London", "Singapore", "New York", "Tokyo", "Sydney", "Berlin", "Toronto", "Paris",
  "Hong Kong", "Seoul", "Bangkok", "Riyadh", "Doha", "Jakarta", "Kuala Lumpur", "Shanghai", "Mexico City", "Sao Paulo"
];

export const AttendeeFeed = () => {
  const [attendee, setAttendee] = useState<{ name: string; location: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setAttendee({ name: randomName, location: randomLocation });

      // Clear after 3 seconds
      setTimeout(() => setAttendee(null), 3000);
    }, 5000 + Math.random() * 3000); // Random interval between 5-8s

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {attendee && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed bottom-6 left-6 z-40 bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <User className="w-4 h-4" />
          </div>
          <div className="text-sm text-white">
            <span className="font-bold text-emerald-400">{attendee.name}</span> joined from <span className="text-gray-400">{attendee.location}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
