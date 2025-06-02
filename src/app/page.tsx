
'use client';
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src={"/assets/hero.png"} alt="Logo" width={200} height={200} />
      <h1>
        Bienvenue sur l&apos;application Next.js avec HeroUI et Tailwind CSS!
      </h1>
      <Link className="p-2 text-white border rounded-md bg-blue-500" href="/contact">Visiter l&apos;application</Link>
    </div>
  );
}
