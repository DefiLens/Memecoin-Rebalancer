import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/base/Header";
import MetaTags from "../components/base/metaTags";
import MainLayout from "../components/base/MainLayout";
import MemecoinsRebalancer from "../components/rebalance/MemecoinsRebalancer";

export default function Home() {
    return (
        <div className="flex flex-col h-screen bg-[#131313]">
            <MetaTags />
            <MainLayout>
                <section className="flex-1 overflow-hidden">
                    <div className=" flex h-full flex-col">
                        <MemecoinsRebalancer />
                    </div>
                </section>
            </MainLayout>
            <ToastContainer theme="dark" />
        </div>
    );
}
