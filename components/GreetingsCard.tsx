
import Image from "next/image";

export default function GreetingsCard() {

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return(
    <>
      <div className="w-full h-[10rem] rounded-xl shadow-md bg-primary-foreground dark:bg-neutral-900 flex items-center justify-between overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col justify-center pl-6 text-white">
        <h2 className="text-xl font-semibold font-serif">{greeting},</h2>
        <p className="text-lg font-serif">Francis</p>
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