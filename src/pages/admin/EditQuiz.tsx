import {
    useEffect,
    useState,
} from "react"

import {
    useNavigate,
    useParams,
} from "react-router-dom"

import axios from "axios"

import Joi from "joi"

import {
    useForm,
} from "react-hook-form"

import {
    joiResolver,
} from "@hookform/resolvers/joi"

import { toast } from "react-toastify"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"

interface Question {
    publicId: string

    questionText: string

    answerType: string

    versionNumber: number
}

interface Quiz {
    publicId: string

    title: string

    questions: Question[]
}

interface EditQuizFormData {
    title: string
}

const editQuizSchema =
    Joi.object({
        title: Joi.string()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
                "string.empty":
                    "Quiz title is required",
            }),
    })

const EditQuiz = () => {
    const { publicId } =
        useParams()

    const navigate =
        useNavigate()

    const [questions,
        setQuestions] =
        useState<Question[]>([])

    const [
        selectedQuestions,
        setSelectedQuestions,
    ] = useState<string[]>([])

    const [
        isPageLoading,
        setIsPageLoading,
    ] = useState(true)

    const token = useSelector((state: RootState) => state.auth.token);

    const {
        register,
        handleSubmit,
        reset,

        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<EditQuizFormData>({
        resolver:
            joiResolver(
                editQuizSchema
            ),
    })

    const fetchQuestions =
        async () => {
            const response =
                await axios.get(
                    "http://localhost:3000/api/questions",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                )

            setQuestions(
                response.data.data
                    .filter(Boolean)
            )
        }

    const fetchQuiz =
        async () => {
            try {
                const response =
                    await axios.get(
                        `http://localhost:3000/api/quizzes/${publicId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    )

                const quiz:
                    Quiz =
                    response.data.data

                reset({
                    title:
                        quiz.title,
                })

                setSelectedQuestions(
                    quiz.questions.map(
                        (
                            question
                        ) =>
                            question.publicId
                    )
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch quiz"
                )
            }
        }

    const loadPage =
        async () => {
            try {
                setIsPageLoading(
                    true
                )

                await Promise.all([
                    fetchQuestions(),
                    fetchQuiz(),
                ])
            } finally {
                setIsPageLoading(
                    false
                )
            }
        }

    useEffect(() => {
        loadPage()
    }, [])

    const onSubmit =
        async (
            data:
                EditQuizFormData
        ) => {
            try {
                if (
                    selectedQuestions.length ===
                    0
                ) {
                    toast.error(
                        "Select at least one question"
                    )

                    return
                }

                const payload = {
                    title: data.title,

                    questionPublicIds:
                        selectedQuestions,
                }

                await axios.put(
                    `http://localhost:3000/api/quizzes/${publicId}`,
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                )

                toast.success(
                    "Quiz updated successfully"
                )

                navigate(
                    "/admin/quizzes"
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to update quiz"
                )
            }
        }

    if (isPageLoading) {
        return (
            <div className="p-6">
                Loading quiz...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Edit Quiz
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Modify quiz details and questions.
                </p>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>
                        Quiz Details
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label>
                                Quiz Title
                            </Label>

                            <Input
                                placeholder="Enter quiz title"
                                {
                                ...register(
                                    "title"
                                )
                                }
                            />

                            {
                                errors.title && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .title
                                                .message
                                        }
                                    </p>
                                )
                            }
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>
                                    Select Questions
                                </Label>

                                <span className="text-sm text-muted-foreground">
                                    {
                                        selectedQuestions.length
                                    }
                                    {" "}
                                    selected
                                </span>
                            </div>

                            <div className="rounded-md border">
                                {
                                    questions.map(
                                        (
                                            question
                                        ) => (
                                            <div
                                                key={
                                                    question.publicId
                                                }
                                                className="flex items-start gap-3 border-b p-4 last:border-b-0"
                                            >
                                                <Checkbox
                                                    checked={selectedQuestions.includes(
                                                        question.publicId
                                                    )}

                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (
                                                            checked
                                                        ) {
                                                            setSelectedQuestions(
                                                                (
                                                                    prev
                                                                ) =>
                                                                    prev.includes(
                                                                        question.publicId
                                                                    )
                                                                        ? prev
                                                                        : [
                                                                            ...prev,
                                                                            question.publicId,
                                                                        ]
                                                            )
                                                        } else {
                                                            setSelectedQuestions(
                                                                (
                                                                    prev
                                                                ) =>
                                                                    prev.filter(
                                                                        (
                                                                            id
                                                                        ) =>
                                                                            id !==
                                                                            question.publicId
                                                                    )
                                                            )
                                                        }
                                                    }}
                                                />

                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {
                                                            question.questionText
                                                        }
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            question.answerType
                                                                .replaceAll(
                                                                    "_",
                                                                    " "
                                                                )
                                                        }

                                                        {" • "}

                                                        v
                                                        {
                                                            question.versionNumber
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                            >
                                {
                                    isSubmitting
                                        ? "Updating..."
                                        : "Update Quiz"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditQuiz