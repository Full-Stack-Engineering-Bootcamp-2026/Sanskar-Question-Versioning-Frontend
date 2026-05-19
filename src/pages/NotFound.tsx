import { Link } from "react-router-dom"

import {
    ArrowLeft,
    FileQuestionMark,
} from "lucide-react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
            <Card className="w-full max-w-lg border shadow-sm">
                <CardContent className="flex flex-col items-center space-y-6 p-10 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <FileQuestionMark className="h-10 w-10 text-blue-700" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold tracking-tight text-gray-900">
                            404
                        </h1>

                        <h2 className="text-2xl font-semibold text-gray-800">
                            Page Not Found
                        </h2>

                        <p className="mx-auto max-w-md text-sm text-muted-foreground">
                            The page you are looking for does not exist
                            or may have been moved.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                            asChild
                        >
                            <Link to="/">
                                Dashboard
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                        >
                            <Link to="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default NotFound