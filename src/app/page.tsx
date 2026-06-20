import Link from "next/link";


export default function Home() {
  return (
    <div className="h-52 flex justify-center items-center" >
    <Link href="/" className="text-4xl font-bold text-(--text)">
          Skill<span className="text-(--primary)">Bridge</span>
        </Link>
    </div>
  );
}
