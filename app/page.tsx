import Image from "next/image";
import logo from "../public/ecop.svg";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-white min-h-screen p-0 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center justify-center">
        <div>
          <Image src={logo} alt="eCop logo" width={180} height={38} priority />
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border text-white   flex items-center justify-center bg-[#15134A] gap-2 hover:opacity-30 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-36"
            href="/auth/login"
            rel="noopener noreferrer"
          >
            SignIn
          </a>
          <a
            className="rounded-full text-white flex items-center justify-center bg-[#6DB6FE] gap-2 hover:opacity-30 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-36"
            href="/auth/signup"
            rel="noopener noreferrer"
          >
            SignUp
          </a>
        </div>
      </main>
    </div>
  );
}
