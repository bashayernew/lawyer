type Member = {
  id: string
  nameEn: string
  nameAr: string
  title: string
  specialties: string[]
  bio: string
}

export default function TeamCard({ member }: { member: Member }) {
  return (
    <article className="border rounded-xl p-4 bg-white">
      <div className="h-36 rounded-lg bg-neutral-100 border mb-3" />
      <div className="font-serif text-lg">{member.nameEn}</div>
      <div className="rtl text-sm text-neutral-600">{member.nameAr}</div>
      <div className="text-sm text-neutral-700 mt-1">{member.title}</div>
      <div className="text-xs text-neutral-500 mt-1">{member.specialties.join(' • ')}</div>
      <p className="text-sm text-neutral-700 mt-2">{member.bio}</p>
      <a className="btn btn-gold mt-3" href={`/team/${member.id}`}>View Profile</a>
    </article>
  )
}


