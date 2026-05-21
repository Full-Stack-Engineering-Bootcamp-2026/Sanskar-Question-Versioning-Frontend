import {
    useEffect,
    useState,
} from "react"

import {
    useNavigate,
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

import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AuroraText } from "@/components/ui/aurora-text"

interface Option {
    publicId: string

    optionText: string
}

interface Question {
    questionVersionPublicId: string

    questionText: string

    answerType: string

    options: Option[]
}

interface Quiz {
    publicId: string

    title: string

    questions: Question[]
}

interface SubmitAnswer {
    questionVersionPublicId: string

    selectedOptions?: string[]

    textAnswer?: string
}

const AttemptQuiz = () => {
    const { publicId } =
        useParams()

    const navigate =
        useNavigate()

    const [quiz,
        setQuiz] =
        useState<Quiz | null>(
            null
        )

    const [answers,
        setAnswers] =
        useState<
            SubmitAnswer[]
        >([])

    const [isLoading,
        setIsLoading] =
        useState(false)

    const [isSubmitting,
        setIsSubmitting] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchQuiz =
        async () => {
            try {
                setIsLoading(true)

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

                setQuiz(
                    response.data.data
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch quiz"
                )
            } finally {
                setIsLoading(false)
            }
        }

    useEffect(() => {
        fetchQuiz()
    }, [])

    const handleSingleSelect =
        (
            questionVersionPublicId: string,
            optionPublicId: string
        ) => {
            setAnswers(
                (prev) => [
                    ...prev.filter(
                        (
                            answer
                        ) =>
                            answer.questionVersionPublicId !==
                            questionVersionPublicId
                    ),

                    {
                        questionVersionPublicId,

                        selectedOptions: [
                            optionPublicId,
                        ],
                    },
                ]
            )
        }

    const handleMultiSelect =
        (
            questionVersionPublicId: string,
            optionPublicId: string,
            checked: boolean
        ) => {
            const existing =
                answers.find(
                    (
                        answer
                    ) =>
                        answer.questionVersionPublicId ===
                        questionVersionPublicId
                )

            let updatedOptions =
                existing
                    ?.selectedOptions || []

            if (checked) {
                updatedOptions = [
                    ...updatedOptions,
                    optionPublicId,
                ]
            } else {
                updatedOptions =
                    updatedOptions.filter(
                        (
                            id
                        ) =>
                            id !==
                            optionPublicId
                    )
            }

            setAnswers(
                (prev) => [
                    ...prev.filter(
                        (
                            answer
                        ) =>
                            answer.questionVersionPublicId !==
                            questionVersionPublicId
                    ),

                    {
                        questionVersionPublicId,

                        selectedOptions:
                            updatedOptions,
                    },
                ]
            )
        }

    const handleTextAnswer =
        (
            questionVersionPublicId: string,
            value: string
        ) => {
            setAnswers(
                (prev) => [
                    ...prev.filter(
                        (
                            answer
                        ) =>
                            answer.questionVersionPublicId !==
                            questionVersionPublicId
                    ),

                    {
                        questionVersionPublicId,

                        textAnswer:
                            value,
                    },
                ]
            )
        }

    const submitQuiz =
        async () => {
            if (!quiz) return

            for (const question of quiz.questions) {

                const answer =
                    answers.find((item) => item.questionVersionPublicId === question.questionVersionPublicId)

                if (!answer) {
                    toast.error("Please answer all questions")
                    return
                }

                if (
                    question.answerType ===
                    "TEXT"
                ) {
                    if (
                        !answer.textAnswer ||
                        answer.textAnswer.trim() === ""
                    ) {
                        toast.error(
                            "Please answer all questions"
                        )

                        return
                    }
                }

                else {
                    if (
                        !answer.selectedOptions ||
                        answer.selectedOptions.length === 0
                    ) {
                        toast.error(
                            "Please answer all questions"
                        )

                        return
                    }
                }
            }
            try {
                setIsSubmitting(
                    true
                )

                const payload = {
                    quizPublicId:
                        publicId,

                    answers,
                }

                await axios.post(
                    "http://localhost:3000/api/attempts",
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                )

                toast.success(
                    "Quiz submitted successfully"
                )

                navigate(
                    "/attempts"
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to submit quiz"
                )
            } finally {
                setIsSubmitting(
                    false
                )
            }
        }

    if (isLoading || !quiz) {
        return (
            <div className="p-6">
                Loading quiz...
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                   <AuroraText>{quiz.title}</AuroraText> 
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    <TypingAnimation>Answer all questions carefully.</TypingAnimation>
                </p>
            </div>

            {
                quiz.questions.map(
                    (
                        question,
                        index
                    ) => (
                        <Card
                            key={
                                question.questionVersionPublicId
                            }
                        >
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">
                                    {index + 1}.
                                    {" "}
                                    {
                                        question.questionText
                                    }
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-6">
                                {
                                    question.answerType ===
                                    "SINGLE_SELECT" && (
                                        <RadioGroup
                                            onValueChange={(
                                                value
                                            ) =>
                                                handleSingleSelect(
                                                    question.questionVersionPublicId,
                                                    value
                                                )
                                            }
                                        >
                                            {
                                                question.options.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <div
                                                            key={
                                                                option.publicId
                                                            }
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <RadioGroupItem
                                                                value={
                                                                    option.publicId
                                                                }
                                                                id={
                                                                    option.publicId
                                                                }
                                                            />

                                                            <Label
                                                                htmlFor={
                                                                    option.publicId
                                                                }
                                                            >
                                                                {
                                                                    option.optionText
                                                                }
                                                            </Label>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </RadioGroup>
                                    )
                                }

                                {
                                    question.answerType ===
                                    "MULTI_SELECT" && (
                                        <div className="space-y-3">
                                            {
                                                question.options.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <div
                                                            key={
                                                                option.publicId
                                                            }
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    handleMultiSelect(
                                                                        question.questionVersionPublicId,
                                                                        option.publicId,
                                                                        Boolean(
                                                                            checked
                                                                        )
                                                                    )
                                                                }
                                                            />

                                                            <Label>
                                                                {
                                                                    option.optionText
                                                                }
                                                            </Label>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    )
                                }

                                {
                                    question.answerType ===
                                    "TEXT" && (
                                        <Input
                                            placeholder="Enter your answer"
                                            onChange={(
                                                event
                                            ) =>
                                                handleTextAnswer(
                                                    question.questionVersionPublicId,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    )
                                }
                            </CardContent>
                        </Card>
                    )
                )
            }

            <div className="flex justify-end">

                <AlertDialog>

                    <AlertDialogTrigger asChild>
                        <Button
                            disabled={
                                isSubmitting
                            }
                        >
                            {
                                isSubmitting
                                    ? "Submitting..."
                                    : "Submit Quiz"
                            }
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>

                        <AlertDialogHeader>

                            <AlertDialogTitle>
                                Submit Quiz?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Once submitted, you will not be able to change your answers.
                            </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>

                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={
                                    submitQuiz
                                }
                            >
                                Confirm Submit
                            </AlertDialogAction>

                        </AlertDialogFooter>

                    </AlertDialogContent>

                </AlertDialog>

            </div>
        </div>
    )
}

export default AttemptQuiz