import {
    BookOpen,
    Plus,
    Search,
    ChevronRight,
    Trash2,
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Joi from "joi"
import { useFieldArray, useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"
enum AnswerType {
    SINGLE_SELECT = "SINGLE_SELECT",
    MULTI_SELECT = "MULTI_SELECT",
    TEXT = "TEXT",
}

interface Question {
    publicId: string
    questionText: string
    answerType: string
    versionNumber: number
    options: {
        id: number
        optionText: string
    }[]
}
const createQuestionSchema = Joi.object({
    questionText: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required(),

    answerType: Joi.string()
        .valid(
            ...Object.values(
                AnswerType
            )
        )
        .required(),

    options: Joi.when(
        "answerType",
        {
            is: Joi.valid(
                AnswerType.SINGLE_SELECT,
                AnswerType.MULTI_SELECT
            ),

            then: Joi.array()
                .items(
                    Joi.object({
                        value: Joi.string()
                            .trim()
                            .required()
                            .messages({
                                "string.empty":
                                    "Option cannot be empty",
                            }),
                    })
                )
                .min(2)
                .required(),

            otherwise: Joi.optional(),
        }
    ),
})
interface CreateQuestionFormData {
    questionText: string

    answerType: AnswerType

    options: {
        value: string
    }[]
}

const Dashboard = () => {
    const [questions, setQuestions] = useState<Question[] | null>([])
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
    const token = useSelector((state: RootState) => state.auth.token)
    const {
        register,
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateQuestionFormData>({
        resolver: joiResolver(createQuestionSchema),

        defaultValues: {
            questionText: "",
            answerType:
                AnswerType.SINGLE_SELECT,
            options: [
                { value: "" },
                { value: "" },
            ],
        },
    })

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,

        name: "options",
    })

    const answerType = watch(
        "answerType"
    )

    const fetchQuestions =
        async () => {
            try {
                setIsLoadingQuestions(true)

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
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch questions"
                )
            } finally {
                setIsLoadingQuestions(false)
            }
        }
    const onSubmit = async (
        data: CreateQuestionFormData
    ) => {
        try {
            const payload = {
                questionText: data.questionText,
                answerType: data.answerType,
                options: data.answerType === AnswerType.TEXT ? undefined : data.options.map(option =>
                    option.value
                )
            }
            await axios.post(
                "http://localhost:3000/api/questions",
                payload,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            )

            toast.success(
                "Question created successfully"
            )
            await fetchQuestions();
            reset()
        } catch (error) {
            console.log(error)

            toast.error(
                "Failed to create question"
            )
        }
    }
    useEffect(() => {
        fetchQuestions()
    }, [])
    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Management Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Oversee your questions, build quizzes, and track performance.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <CardTitle className="text-base">
                                Create New Question
                            </CardTitle>

                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label>
                                        Question Text
                                    </Label>

                                    <Input placeholder="Enter the main question prompt here..." {...register("questionText")} />
                                    {
                                        errors.questionText && (
                                            <p className="text-sm text-red-500">
                                                {errors.questionText.message}
                                            </p>
                                        )
                                    }
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>
                                            Answer Type
                                        </Label>

                                        <Select
                                            value={answerType}
                                            onValueChange={(value) =>
                                                setValue(
                                                    "answerType",
                                                    value as AnswerType,
                                                    {
                                                        shouldValidate: true,
                                                    }
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select answer type" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem
                                                    value={
                                                        AnswerType.SINGLE_SELECT
                                                    }
                                                >
                                                    Multiple Choice
                                                </SelectItem>

                                                <SelectItem
                                                    value={
                                                        AnswerType.MULTI_SELECT
                                                    }
                                                >
                                                    Checkbox
                                                </SelectItem>

                                                <SelectItem
                                                    value={
                                                        AnswerType.TEXT
                                                    }
                                                >
                                                    Short Text
                                                </SelectItem>

                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Category
                                        </Label>

                                        <Input placeholder="e.g. Science, History" />
                                    </div>
                                </div>

                                {
                                    answerType !==
                                    AnswerType.TEXT && (
                                        <div className="space-y-3">
                                            <Label>
                                                Options
                                            </Label>

                                            {
                                                fields.map(
                                                    (
                                                        field,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                field.id
                                                            }
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Input
                                                                placeholder={`Option ${index + 1}`}
                                                                {
                                                                ...register(
                                                                    `options.${index}.value`
                                                                )
                                                                }
                                                            />

                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    remove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )
                                            }
                                            {
                                                errors.options && (
                                                    <p className="text-sm text-red-500">
                                                        At least 2 options are required
                                                    </p>
                                                )
                                            }

                                            <Button
                                                type="button"
                                                variant="link"
                                                className="px-0 text-blue-600"
                                                onClick={() =>
                                                    append({
                                                        value: "",
                                                    })
                                                }
                                            >
                                                + Add Another Option
                                            </Button>
                                        </div>
                                    )
                                }

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-700 hover:bg-blue-800"
                                    >
                                        {
                                            isSubmitting
                                                ? "Saving..."
                                                : "Save Question"
                                        }
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <CardTitle className="text-base">
                                Question Bank
                            </CardTitle>

                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    placeholder="Search prompts..."
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table className="w-full text-sm">
                                <TableHeader className="bg-muted/40 text-muted-foreground">
                                    <TableRow className="border-b">
                                        <TableHead className="px-4 py-3 text-left font-medium">
                                            Question Prompt
                                        </TableHead>

                                        <TableHead className="px-4 py-3 text-left font-medium">
                                            Version
                                        </TableHead>

                                        <TableHead className="px-4 py-3 text-left font-medium">
                                            Type
                                        </TableHead>

                                        <TableHead className="px-4 py-3 text-right font-medium">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {
                                        isLoadingQuestions ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-24 text-center"
                                                >
                                                    Loading questions...
                                                </TableCell>
                                            </TableRow>
                                        ) : questions?.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-24 text-center"
                                                >
                                                    No questions found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            questions?.filter(Boolean).map(
                                                (question) => (
                                                    <TableRow
                                                        key={
                                                            question.publicId
                                                        }
                                                    >
                                                        <TableCell className="px-4 py-3">
                                                            {
                                                                question.questionText
                                                            }
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3 text-blue-600">
                                                            v
                                                            {
                                                                question.versionNumber
                                                            }
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3">
                                                            {
                                                                question.answerType
                                                                    .replaceAll(
                                                                        "_",
                                                                        " "
                                                                    )
                                                            }
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3 text-right">
                                                            <Button
                                                                variant="link"
                                                                className="h-auto p-0"
                                                            >
                                                                Edit
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

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle className="text-base">
                                Assemble Quiz
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label>
                                    Quiz Title
                                </Label>

                                <Input placeholder="e.g. General Knowledge v1" />
                            </div>

                            <div className="space-y-3">
                                <Label>
                                    Select Questions
                                </Label>

                                <div className="rounded-md border">
                                    {
                                        questions
                                            ?.filter(Boolean)
                                            .map((question) => (
                                                <div
                                                    key={question.publicId}
                                                    className="flex items-start gap-3 border-b p-3 last:border-b-0"
                                                >
                                                    <Checkbox />

                                                    <div className="space-y-1">
                                                        <p className="text-sm">
                                                            {question.questionText}
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
                                            ))
                                    }
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
                                <span className="text-sm font-medium">
                                    Selected Items
                                </span>

                                <span className="text-sm font-semibold text-blue-600">
                                    0
                                </span>
                            </div>

                            <Button className="w-full bg-blue-700 hover:bg-blue-800">
                                Publish Quiz
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle className="text-base">
                                Recent Quizzes
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-6">
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-blue-100 p-2">
                                        <BookOpen className="h-4 w-4 text-blue-700" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            General Science v2
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Updated Oct 24, 2023
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-blue-100 p-2">
                                        <BookOpen className="h-4 w-4 text-blue-700" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Staff Onboarding
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Updated Oct 22, 2023
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-blue-100 p-2">
                                        <BookOpen className="h-4 w-4 text-blue-700" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Final Exams 2023
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Updated Oct 15, 2023
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard