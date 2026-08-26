"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

type ContactDeveloperButtonProps = {
  developerId: number | string | undefined;
};

export default function ContactDeveloperButton({
  developerId,
}: ContactDeveloperButtonProps) {
  return (
    <Link
      href={`/pages/recruiter/MessagePage?developerId=${developerId}`}
      className="
        group
        fixed
        right-5
        top-1/2
        z-50
        hidden
        -translate-y-1/2
        items-center
        gap-2.5
        overflow-hidden
        rounded-2xl
        border
        border-white/20
        bg-[var(--primary)]
        px-4
        py-3
        text-sm
        font-semibold
        text-white
        shadow-[var(--shadow)]
        transition-all
        duration-300
        hover:-translate-x-1
        hover:bg-[var(--primary-hover)]
        hover:px-5
        hover:shadow-[0_12px_35px_rgba(91,108,255,0.35)]
        active:scale-95
        lg:flex
      "
    >
      <span
        className="
          relative
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white/15
        "
      >
        <MessageCircle size={18} />

        <span
          className="
            absolute
            -right-0.5
            -top-0.5
            h-2
            w-2
            animate-pulse
            rounded-full
            bg-white
          "
        />
      </span>

      <span className="whitespace-nowrap">Contact Developer</span>

      <ArrowRight
        size={16}
        className="
          -ml-1
          opacity-0
          transition-all
          duration-300
          group-hover:ml-0
          group-hover:translate-x-0.5
          group-hover:opacity-100
        "
      />
    </Link>
  );
}
