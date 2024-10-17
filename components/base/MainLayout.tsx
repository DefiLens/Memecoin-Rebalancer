import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MemecoinsRebalancer from "../rebalance/MemecoinsRebalancer";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: any) => {
    const [openSidebar, setOpenSidebar] = useState(false);
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#131313]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#131313] ml-[71px]">
                <Header />
                <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
