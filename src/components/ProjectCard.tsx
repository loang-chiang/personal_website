type Props = { title: string; desc: string; tags?: string[]; link?: string };
export default function ProjectCard({ title, desc, tags = [], link }: Props) {
  return (
    <article className="rounded-2xl border p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-700">{desc}</p>
      {tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
          {tags.map(t => <li key={t} className="rounded bg-neutral-100 px-2 py-1">{t}</li>)}
        </ul>
      )}
      {link && (
        <a className="mt-3 inline-block text-sm underline" href={link} target="_blank">
          View
        </a>
      )}
    </article>
  );
}