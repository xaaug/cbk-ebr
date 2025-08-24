
import Image from "next/image";

export default function SectionHeader({title}: {title: string}) {


  return(
    <>
      <div className="w-full h-[8rem] rounded-xl shadow-md bg-transparent dark:bg-neutral-900 flex items-center justify-between overflow-hidden border  border-primary-foreground">
      {/* Left Section */}
      <div className="flex flex-col justify-center pl-6 text-white">
        <h2 className="font-serif font-semibold text-2xl text-primary-foreground">{title}</h2>
      </div>

      {/* Right Section */} 
      <div className="relative h-full w-2/4">
        <Image
          src="/logo-intro.svg"
          alt="Logo"
          fill
          className="object-cover "
        />
      </div>
    </div>
    </>
  )
}