import React from "react";
import { IoCompassOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
const Sidebar = () => {
    return (
        <div
            className={`absolute z-50 hover:w-48 w-[71px] h-screen bg-B1 border-r border-zinc-700 transition-all duration-75 group`}
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
                                <div key={index} className="flex-1 flex -mx-1 overflow-hidden">
                                    <div
                                        className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center group-hover:hover:bg-zinc-800 group-hover:hover:bg-opacity-80"
                                    >
                                        <div className="flex items-center">
                                            <span
                                                className="h-6 text-zinc-200 mr-[13px] relative left-[3px]"
                                            >
                                                <item.icon className="text-[25px]" />
                                            </span>
                                            <span className="transition-opacity duration-75">{item.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-[30px]">
                        <h2 className="text-xs font-medium font-dm-sans text-zinc-100 tracking-wide mb-4 whitespace-nowrap max-w-[38px] flex justify-center">
                            Wallet
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex-1 flex -mx-1 overflow-hidden ">
                                <a
                                    className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-2 py-2.5 w-full h-11 rounded-md items-center bg-zinc-800 border border-zinc-700 hover:bg-opacity-80"
                                >
                                    <div className="flex items-center">
                                        <span>
                                            <IoWalletOutline className="text-[30px] mr-[13px] text-zinc-200" />
                                        </span>
                                        <span className="transition-opacity duration-75">
                                            Wallet
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

const data = [
    {
        icon: IoCompassOutline,
        title: "Market",
    },
    {
        icon: IoBookmarkOutline,
        title: "Bookmark",
    },
];
