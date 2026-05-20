import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { RootState } from "@/redux/stores/store"

import {
    BookOpen,
    CircleQuestionMark,
    ClipboardCheck,
    FileQuestionMark,
    LayoutDashboard,
    PlusCircle,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom"
import { Button } from "./ui/button"
import { logout } from "@/redux/slices/authSlice"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { AuroraText } from "./ui/aurora-text"

const adminItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin/dashboard",
    },
    {
        title: "Create Question",
        icon: CircleQuestionMark,
        url: "/admin/questions/create"
    },

    {
        title: "Questions",
        icon: FileQuestionMark,
        url: "/admin/questions",
    },

    {
        title: "Create Quiz",
        icon: PlusCircle,
        url: "/admin/quizzes/create",
    },

    {
        title: "All Quizzes",
        icon: BookOpen,
        url: "/admin/quizzes",
    },
]

const userItems = [
    {
        title: "Available Quizzes",
        icon: BookOpen,
        url: "/quizzes",
    },

    {
        title: "My Attempts",
        icon: ClipboardCheck,
        url: "/attempts",
    },
]


const AppSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = () => {
        dispatch(logout());
        navigate("/");
    }
    const location = useLocation()
    const user = useSelector((state: RootState) => state.auth.user)
    const items = user?.role === "ADMIN"
        ? adminItems
        : userItems

    return (
        <Sidebar className="border-r ">
            <SidebarHeader className="border-b px-4 py-4">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary">
                        <FileQuestionMark className="h-5 w-5 " />
                    </div>

                    <div>
                        <h1 className="font-serif text-2xl font-semibold">
                            <AuroraText>
                                QuizMaster
                            </AuroraText>
                        </h1>

                        <p className="text-xs">
                            Quiz Application
                        </p>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                items.map(
                                    (
                                        item
                                    ) => (
                                        <SidebarMenuItem
                                            key={
                                                item.title
                                            }
                                        >
                                            <SidebarMenuButton
                                                asChild

                                                isActive={
                                                    location.pathname ===
                                                    item.url
                                                }

                                                className="h-10 rounded-md"
                                            >
                                                <Link
                                                    to={
                                                        item.url
                                                    }
                                                >
                                                    <item.icon className="h-4 w-4" />

                                                    <span>
                                                        {
                                                            item.title
                                                        }
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t px-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>

                        <AlertDialog>

                            <AlertDialogTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="h-10 w-full rounded-md flex justify-center text-red-600 hover:text-red-600"
                                >
                                    Logout
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>

                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Logout?
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                        You will need to login again to access your account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>

                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={handleClick}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Logout
                                    </AlertDialogAction>

                                </AlertDialogFooter>

                            </AlertDialogContent>

                        </AlertDialog>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar