import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../components/layouts/MainLayout";
import Market from "../components/rebalance/Market";
import MetaTags from "../components/base/MetaTags";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#131313]">
      <MetaTags />
      <MainLayout>
        <Market />
      </MainLayout>
      <ToastContainer theme="dark" />
    </div>
  );
}
