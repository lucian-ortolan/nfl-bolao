import Link from 'next/link'
import { getUserFromSession } from '@/src/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getUserFromSession()
  if (user) redirect('/rodadas')

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Bolão NFL Playoffs</h1>
      <p className="text-zinc-300">Entre e faça seus palpites.</p>

      <div className="flex gap-3">
        <Link className="rounded-md bg-zinc-100 px-3 py-2 text-zinc-900" href="/login">Login</Link>
        <Link className="rounded-md border border-zinc-700 px-3 py-2" href="/register">Cadastro</Link>
      </div>
    </div>
  )
}
