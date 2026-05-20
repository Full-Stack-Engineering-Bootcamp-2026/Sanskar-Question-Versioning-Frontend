import { Outlet } from "react-router-dom"

import {
    SidebarProvider,
} from "@/components/ui/sidebar"

import AppSidebar from "@/components/app-sidebar"

const Layout = () => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />

                <main className="min-w-0 flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Layout