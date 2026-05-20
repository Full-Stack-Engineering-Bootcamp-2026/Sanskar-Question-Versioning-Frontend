import {
    Pencil,
    Plus,
    Trash2,
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import axios from "axios"

import {
    useEffect,
    useState,
} from "react"

import { toast } from "react-toastify"

import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import { AuroraText } from "@/components/ui/aurora-text"
import { TypingAnimation } from "@/components/ui/typing-animation"

interface Quiz {
    publicId: string

    title: string

    createdAt: string

    totalQuestions: number
}

const QuizList = () => {
    const [quizzes, setQuizzes] =
        useState<Quiz[]>([])

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchQuizzes =
        async () => {
            try {
                setIsLoading(true)

                const response =
                    await axios.get(
                        "http://localhost:3000/api/quizzes",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    )

                setQuizzes(
                    response.data.data
                )

            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch quizzes"
                )
            } finally {
                setIsLoading(false)
            }
        }

    const deleteQuiz =
        async (
            publicId: string
        ) => {
            try {

                await axios.patch(
                    `http://localhost:3000/api/quizzes/${publicId}`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                )

                toast.success(
                    "Quiz deleted successfully"
                )

                fetchQuizzes()

            } catch (error) {

                console.log(error)

                toast.error(
                    "Failed to delete quiz"
                )
            }
        }

    useEffect(() => {
        fetchQuizzes()
    }, [])

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        <AuroraText>
                            <TypingAnimation>
                                All Quizzes
                            </TypingAnimation>
                        </AuroraText>
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and organize quizzes.
                    </p>
                </div>

                <Button asChild>
                    <Link to="/admin/quizzes/create">
                        <Plus className="mr-2 h-4 w-4" />

                        Create Quiz
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>
                        All Quizzes
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="h-120 overflow-y-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Title
                                    </TableHead>
                                    <TableHead>
                                        Created At
                                    </TableHead>

                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    isLoading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                Loading quizzes...
                                            </TableCell>
                                        </TableRow>
                                    ) : quizzes.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                No quizzes found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        quizzes.map(
                                            (quiz) => (
                                                <TableRow
                                                    key={
                                                        quiz.publicId
                                                    }
                                                >
                                                    <TableCell className="font-medium">
                                                        {
                                                            quiz.title
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            new Date(
                                                                quiz.createdAt
                                                            ).toLocaleDateString()
                                                        }
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                asChild
                                                                size="icon"
                                                                variant="outline"
                                                            >
                                                                <Link
                                                                    to={`/admin/quizzes/${quiz.publicId}/edit`}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete Quiz?
                                                                        </AlertDialogTitle>

                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>

                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>

                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                deleteQuiz(
                                                                                    quiz.publicId
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizList