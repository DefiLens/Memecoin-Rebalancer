import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MemecoinsRebalancer from "../rebalance/MemecoinsRebalancer";
import Sidebar from "./Sidebar";

const MainLayout = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#131313]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#131313] ml-16">
                <Header />
                <main className="flex flex-col flex-1 overflow-hidden">
                    {/* <section className="px-2 pt-2">{isConnected && <WalletInfo />}</section> */}

                    <section className="flex-1 overflow-hidden">
                        <div className="p-2 flex h-full flex-col">
                            <MemecoinsRebalancer />
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
