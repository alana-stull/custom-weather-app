// src/components/ActionButton.tsx

import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  text: string;
  href: string;
}

export function ActionButton({ text, href }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition transform hover:scale-105 whitespace-nowrap">
        {text}
      </button>
    </Link>
  );
}