import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
// import ClientOnly from "./ClientOnly";
// import { tabList } from "../../utils/constant";

interface MainLayoutProps {
    children: ReactNode;
    searchOption?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, searchOption }) => {
    const location = usePathname();

    return (
        <div className="flex flex-col h-screen bg-dark-bg text-white">
            {/* <Header /> */}
            <header className="bg-dark-surface">
                <div className="mx-auto bg-gray-950">
                    <div className="bg-gray-950 px-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-end h-fit sm:h-14 border-y border-gray-800">
                        <div className="grid grid-cols-3 sm:flex items-end border-zinc-500 h-10">
                            {tabList.map((item) => {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-center gap-2 font-medium text-[.7rem] sm:text-sm px-3 sm:px-6 py-2 transition-all duration-300 border-b-2 tracking-wide whitespace-nowrap ${
                                            location === item.href
                                                ? "border-primary-hover text-zinc-100"
                                                : "border-transparent text-zinc-400 hover:text-zinc-100"
                                        }`}
                                    >
                                        <span>
                                            <item.icon className="hidden sm:block sm:text-xs" />
                                        </span>
                                        {item.name}
                                        {item.href === "/new-pool" && (
                                            <span className="text-[10px] flex items-center gap-2 bg-zinc-800 rounded-xl p-0.5 px-2">
                                                <span className="block animate-ping h-1 w-1 bg-green-500 rounded-full" />
                                                Live
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        {searchOption}
                    </div>
                </div>
            </header>
            {children}
            {/* <Footer /> */}
        </div>
    );
};

export default MainLayout;
