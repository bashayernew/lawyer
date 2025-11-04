type Props = { label: string; value: string; href?: string }

export default function ContactCard({ label, value, href }: Props) {
  const content = (
    <div className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  ) : (
    content
  )
}


