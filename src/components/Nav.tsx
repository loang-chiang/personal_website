import Link from "next/link";

export default function Nav() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" }, // optional
  ];
  return (
    <nav className="mb-10 flex gap-5">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} className="hover:underline">
          {label}
        </Link>
      ))}
    </nav>
  );
}