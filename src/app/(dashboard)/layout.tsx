import Header from "@/components/header";
import Footer from "@/components/footer";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <div className="flex-1 p-6">{children}</div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
