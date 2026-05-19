import {
    useEffect,
    useState,
} from "react"

import {
    useParams,
} from "react-router-dom"

import axios from "axios"

import { toast } from "react-toastify"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Badge,
} from "@/components/ui/badge"

import {
    CheckCircle2,
    XCircle,
} from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import { useSelector } from "react-redux"

interface Answer {
    publicId: string

    questionSnapshot: {
        questionText: string

        answerType: string

        options?: string[]
    }

    userAnswer: string | string[]

    isCorrect?: boolean
}

interface Attempt {
    publicId: string

    attemptNumber: number

    status: string

    submittedAt: string

    quiz: {
        title: string
    }

    answers: Answer[]
}

const AttemptDetails = () => {
    const { publicId } =
        useParams()

    const [attempt,
        setAttempt] =
        useState<Attempt | null>(
            null
        )

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchAttempt =
        async () => {
            try {
                setIsLoading(true)

                const response =
                    await axios.get(
                        `http://localhost:3000/api/attempts/${publicId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    )

                setAttempt(
                    response.data.data
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch attempt"
                )
            } finally {
                setIsLoading(false)
            }
        }

    useEffect(() => {
        fetchAttempt()
    }, [])

    if (
        isLoading ||
        !attempt
    ) {
        return (
            <div className="p-6">
                Loading attempt...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {
                            attempt.quiz.title
                        }
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Attempt #
                        {
                            attempt.attemptNumber
                        }
                    </p>
                </div>

                <Badge>
                    {
                        attempt.status
                    }
                </Badge>
            </div>

            {
                attempt.answers.map(
                    (
                        answer,
                        index
                    ) => (
                        <Card
                            key={
                                index
                            }
                        >
                            <CardHeader className="border-b">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-lg leading-relaxed">
                                        {index + 1}.
                                        {" "}
                                        {
                                            answer.questionSnapshot.questionText
                                        }
                                    </CardTitle>

                                    {
                                        answer.isCorrect !==
                                        undefined && (
                                            answer.isCorrect ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )
                                        )
                                    }
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">
                                {
                                    answer.questionSnapshot.options &&
                                    answer.questionSnapshot.options.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                Options
                                            </p>

                                            <div className="space-y-2">
                                                {
                                                    answer.questionSnapshot.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    optionIndex
                                                                }
                                                                className="rounded-md border bg-muted/30 px-4 py-2 text-sm"
                                                            >
                                                                {
                                                                    option
                                                                }
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Your Answer
                                    </p>

                                    {
                                        Array.isArray(
                                            answer.userAnswer
                                        ) ? (
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    answer.userAnswer.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <Badge
                                                                key={
                                                                    index
                                                                }
                                                                variant="secondary"
                                                            >
                                                                {
                                                                    item
                                                                }
                                                            </Badge>
                                                        )
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm">
                                                {
                                                    answer.userAnswer
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )
                )
            }
        </div>
    )
}

export default AttemptDetails