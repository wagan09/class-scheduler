import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-ub-maroon text-white py-2 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center">
            <Image
              src="/images/ub-logo.png"
              alt="University of Batangas Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">University of Batangas</h1>
            <p className="text-xs">Computer Engineering Department</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:inline-block">Class Scheduler</span>
        </div>
      </div>
    </header>
  )
}
