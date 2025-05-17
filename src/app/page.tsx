'use client";';
import PaperBlock from "@/components/ui-kit/PaperBlock";
import TexturedOverlay from "@/components/ui-kit/TextureOverlay";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <PaperBlock className="z-0" background="default">
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="grid grid-rows-2 grid-cols-2 sm:grid-cols-[1fr_1fr] gap-8 items-center justify-items-center">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
              <TexturedOverlay opacity={0.05}>
                <PaperBlock
                  background="default"
                  padding="p-8"
                  className="grid grid-rows-4 grid-cols-4 flex-row flex-grow"
                >
                  <h1 className="text-4xl sm:text-5xl font-bold text-center"></h1>
                </PaperBlock>
              </TexturedOverlay>
              <PaperBlock
                className="flex flex-row flex-grow"
                background="glass"
                padding="p-12"
              >
                <div className="rounded-3xl shadow-md bg-gradient-to-r from-[#001927] to-[#002f40] p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[url('/noise-texture.png')]"></div>
                  <h2 className="text-2xl font-semibold">Mongo-style block</h2>
                  <p className="text-sm opacity-80">
                    Feels layered, clean, and elegant.
                  </p>
                </div>
                <div className="flex w-100 items-center justify-center sm:justify-end">
                  <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                  />
                </div>
              </PaperBlock>
              <div className="flex gap-4 items-center flex-col sm:flex-row">
                <a
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="dark:invert"
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                  Deploy now
                </a>
                <a
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read our docs
                </a>
                <div className="grid grid-cols-2 grid-rows-3 gap-2 items-center">
                  <PaperBlock>
                    <div></div>
                  </PaperBlock>
                </div>
              </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
                />
                Learn
              </a>
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
                />
                Examples
              </a>
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Go to nextjs.org →
              </a>
            </footer>
          </div>{" "}
        </div>
      </PaperBlock>
    </>
  );
}
