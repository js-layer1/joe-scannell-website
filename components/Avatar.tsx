import Image from 'next/image'

export function Avatar() {
  return (
    <div className="flex justify-center">
      <Image
        src="/headshot.jpg"
        alt="Joe Scannell"
        width={96}
        height={96}
        priority
        className="rounded-full object-cover shadow-sm ring-2 ring-[var(--color-border)]"
      />
    </div>
  )
}
