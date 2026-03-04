import { Avatar } from '@/components/Avatar'
import { NameCard } from '@/components/NameCard'
import { LinkList } from '@/components/LinkList'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <Avatar />
        <NameCard />
        <LinkList />
      </div>
    </main>
  )
}
