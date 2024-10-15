import WalletInfo from "../components/base/WalletInfo";
import MemecoinsRebalancer from "../components/rebalance/MemecoinsRebalancer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/base/Footer";
import MetaTags from "../components/base/metaTags";
import MainLayout from "../components/base/MainLayout";

export default function Home() {
    return (
        <div className="flex flex-col h-screen bg-[#131313]">
            <MetaTags />
            {/* <WalletInfo /> */}

            <MainLayout />
            {/* <main className="flex flex-col flex-1 overflow-hidden">
                <section className="flex-1 overflow-hidden">
                    <div className="p-2 flex h-full flex-col">
                        <MemecoinsRebalancer />
                    </div>
                </section>
            </main> */}

            {/* <Footer /> */}
            <ToastContainer theme="dark" />
        </div>
    );
}
