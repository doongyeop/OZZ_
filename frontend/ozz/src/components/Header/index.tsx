interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-secondary text-primary-400 py-5">
      <div className="container mx-auto flex justify-between items-center">
        <button></button>
        <h1 className="text-3xl font-black">{title}</h1>
        <button></button>
      </div>
    </header>
  )
}
