import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "../base/Header";
import Cart from "../base/Cart";

const MainLayout = ({ children }: any) => {
  return (
    <div className="flex !min-h-[100svh] h-full w-screen overflow-hidden bg-zinc-950">
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-950">
        <Header />
        <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
        <Footer />
      </div>
      <Cart />
    </div>
  );
};

export default MainLayout;
