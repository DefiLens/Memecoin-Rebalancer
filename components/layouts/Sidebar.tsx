import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { FiBookmark, FiCompass, FiUpload } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import Image from "next/image";

const Sidebar = () => {
    const router = useRouter();
    const pathname = router.pathname;

    return (
        <div
            className={`hidden sm:block absolute z-50 hover:w-48 w-[70px] h-screen bg-B1 border-r border-zinc-700 transition-all duration-75 group shadow-xl shadow-zinc-700`}
        >
            <div className="h-full flex flex-col py-4">
                {/* Logo */}
                <div className="flex items-center px-4 gap-2">
                    <img src="/assets/logo.svg" alt="DefiLens" className="h-9 w-9" />
                    <h1 className="text-2xl font-bold text-white hidden group-hover:block transition-all duration-300">
                        DefiLens
                    </h1>
                </div>

                <div className="px-4 mt-6 py-3 overflow-x-visible">
                    <div className="mb-[30px]">
                        <h2 className="text-xs font-medium text-zinc-100 tracking-wide mb-4 whitespace-nowrap max-w-[38px] flex justify-center">
                            Explore
                        </h2>

                        <div className="flex flex-col gap-2">
                            {data.map((item: any, index: number) => (
                                <div key={index} onClick={() => router.push(item.href)}>
                                    <div className="flex-1 flex -mx-1 overflow-hidden">
                                        <div
                                            className={`tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center group-hover:hover:bg-zinc-800 group-hover:hover:bg-opacity-80
                                        ${pathname === item.href && "bg-zinc-800"}
                                        `}
                                        >
                                            <div className="flex items-center">
                                                <span
                                                    className={`h-6 mr-[13px] relative left-[3px] ${
                                                        pathname === item.href ? "text-cyan-600" : "text-zinc-200"
                                                    }`}
                                                >
                                                    <item.icon className="text-[25px]" />
                                                </span>
                                                <span className="transition-opacity duration-75 whitespace-nowrap">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <Link href="/wallet">
                        <div className="mb-[30px]">
                            <h2 className="text-xs font-medium font-dm-sans text-zinc-100 tracking-wide mb-4 whitespace-nowrap max-w-[38px] flex justify-center">
                                Wallet
                            </h2>
                            <div className="flex flex-col gap-2">
                                <div className="flex-1 flex -mx-1 overflow-hidden ">
                                    <a className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center bg-zinc-800 border border-zinc-700 hover:bg-opacity-80">
                                        <div className="flex items-center">
                                            <span>
                                                <IoWalletOutline className="text-[30px] mr-[13px] text-zinc-200" />
                                            </span>
                                            <span className="transition-opacity duration-75">Wallet</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Link> */}

{/* <Link href="/wallet"> */}
            <div className="mb-[30px]">
              <h2 className="text-xs font-medium font-dm-sans text-zinc-100 tracking-wide mb-4 whitespace-nowrap max-w-[38px] flex justify-center">
                Chains
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex-1 flex -mx-1 overflow-hidden ">
                  <a href="https://memes.defilens.tech" target="_blank" className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center bg-zinc-800  border-zinc-700 hover:bg-opacity-80">
                    <div className="flex items-center">
                      <span className="h-7 w-7 mr-[13px] text-zinc-200">
                        <Image height={50} width={50} src="/base.svg" alt="Pump Fun" />
                      </span>
                      <span className="transition-opacity duration-75">Base</span>
                    </div>
                  </a>
                </div>
                <div className="flex-1 flex -mx-1 overflow-hidden ">
                  <a href="https://solana.snapbam.fun" target="_blank" className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center bg-zinc-800 border border-zinc-700">
                    <div className="flex items-center">
                      <span className="h-7 w-7 mr-[13px] text-zinc-200">
                        <Image height={50} width={50} src="/solana.webp" alt="Pump Fun" />
                      </span>
                      <span className="transition-opacity duration-75">Solana</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          {/* </Link> */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

const data = [
    {
        icon: FiCompass,
        title: "Market",
        href: "/",
    },
    {
        icon: FiUpload,
        title: "Sell Coins",
        href: "/sell",
    },
    {
        icon: TiStarOutline,
        title: "Bookmark",
        href: "/bookmarks",
    },
    // {
    //     icon: FiDownload,
    //     title: "Deposit USDC",
    //     href: "/deposit-usdc",
    // },
    // // {
    //     icon: FaChartPie,
    //     title: "Meme Portfolio",
    //     href: "/Meme Portfolio",
    // },
];
