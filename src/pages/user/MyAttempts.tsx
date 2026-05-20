import {
    useEffect,
    useState,
} from "react"

import axios from "axios"

import { toast } from "react-toastify"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Badge,
} from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
    Eye,
} from "lucide-react"

import {
    Link,
} from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import { AuroraText } from "@/components/ui/aurora-text"
import { TypingAnimation } from "@/components/ui/typing-animation"

interface Attempt {
    publicId: string

    attemptNumber: number

    status: string

    submittedAt: string

    startedAt: string

    quiz: {
        title: string
    }
}

const MyAttempts = () => {
    const [attempts,
        setAttempts] =
        useState<Attempt[]>([])

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchAttempts =
        async () => {
            try {
                setIsLoading(true)

                const response =
                    await axios.get(
                        "http://localhost:3000/api/attempts/my",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    )

                setAttempts(
                    response.data.data
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch attempts"
                )
            } finally {
                setIsLoading(false)
            }
        }

    useEffect(() => {
        fetchAttempts()
    }, [])

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    <AuroraText>
                        <TypingAnimation>
                            My Attempts
                        </TypingAnimation>
                    </AuroraText>
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    View all your quiz attempts.
                </p>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>
                        Attempt History
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Quiz
                                </TableHead>

                                <TableHead>
                                    Attempt
                                </TableHead>

                                <TableHead>
                                    Status
                                </TableHead>

                                <TableHead>
                                    Submitted At
                                </TableHead>

                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            Loading attempts...
                                        </TableCell>
                                    </TableRow>
                                ) : attempts.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            No attempts found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    attempts.map(
                                        (
                                            attempt
                                        ) => (
                                            <TableRow
                                                key={
                                                    attempt.publicId
                                                }
                                            >
                                                <TableCell className="font-medium">
                                                    {
                                                        attempt.quiz.title
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    #
                                                    {
                                                        attempt.attemptNumber
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            attempt.status ===
                                                                "SUBMITTED"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {
                                                            attempt.status
                                                        }
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        new Date(
                                                            attempt.submittedAt ||
                                                            attempt.startedAt
                                                        ).toLocaleString()
                                                    }
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            to={`/attempts/${attempt.publicId}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />

                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default MyAttempts