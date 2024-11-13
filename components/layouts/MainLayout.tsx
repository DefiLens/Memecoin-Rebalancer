import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "../base/Header";
import Cart from "../base/Cart";

const MainLayout = ({ children }: any) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#131313]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#131313] sm:ml-[71px]">
                <Header />
                <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
                <Footer />
            </div>
            <Cart />
        </div>
    );
};

export default MainLayout;
