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

import { Button } from "@/components/ui/button"

import {
    Badge,
} from "@/components/ui/badge"

import {
    BookOpen,
    Play,
} from "lucide-react"

import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"

interface Quiz {
    publicId: string

    title: string

    totalQuestions: number

    createdAt: string
}

const QuizCatalog = () => {
    const [quizzes,
        setQuizzes] =
        useState<Quiz[]>([])

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state:RootState)=>state.auth.token)

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

    useEffect(() => {
        fetchQuizzes()
    }, [])

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Available Quizzes
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Attempt quizzes and test your knowledge.
                </p>
            </div>

            {
                isLoading ? (
                    <div className="text-sm text-muted-foreground">
                        Loading quizzes...
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No quizzes available
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {
                            quizzes.map(
                                (quiz) => (
                                    <Card
                                        key={
                                            quiz.publicId
                                        }
                                        className="transition-shadow hover:shadow-md"
                                    >
                                        <CardHeader className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="rounded-md bg-primary-foreground p-2">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>

                                                <Badge variant="secondary">
                                                    {
                                                        quiz.totalQuestions
                                                    }
                                                    {" "}
                                                    Questions
                                                </Badge>
                                            </div>

                                            <div>
                                                <CardTitle className="line-clamp-1">
                                                    {
                                                        quiz.title
                                                    }
                                                </CardTitle>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Created on{" "}
                                                    {
                                                        new Date(
                                                            quiz.createdAt
                                                        ).toLocaleDateString()
                                                    }
                                                </p>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <Button
                                                asChild
                                                className="w-full"
                                            >
                                                <Link
                                                    to={`/quizzes/${quiz.publicId}/attempt`}
                                                >
                                                    <Play className="mr-2 h-4 w-4" />

                                                    Start Quiz
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default QuizCatalog