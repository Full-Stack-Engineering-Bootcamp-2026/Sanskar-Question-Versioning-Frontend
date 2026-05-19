import {
    Plus,
    Trash2,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

import {
    useFieldArray,
    useForm,
    Controller,
} from "react-hook-form"

import {
    joiResolver,
} from "@hookform/resolvers/joi"

import Joi from "joi"

import axios from "axios"

import { toast } from "react-toastify"

import {
    useSelector,
} from "react-redux"
import type { RootState } from "@/redux/stores/store"



enum AnswerType {
    SINGLE_SELECT = "SINGLE_SELECT",

    MULTI_SELECT = "MULTI_SELECT",

    TEXT = "TEXT",
}

interface CreateQuestionFormData {
    questionText: string

    answerType: AnswerType

    options: {
        value: string
    }[]
}

const createQuestionSchema =
    Joi.object({
        questionText: Joi.string()
            .trim()
            .min(5)
            .max(500)
            .required()
            .messages({
                "string.empty":
                    "Question is required",
            }),

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

                otherwise:
                    Joi.optional(),
            }
        ),
    })

const CreateQuestion = () => {
    const token =
        useSelector(
            (
                state: RootState
            ) =>
                state.auth.token
        )

    const {
        register,

        control,

        handleSubmit,

        watch,

        reset,

        formState: {
            errors,
            isSubmitting,
        },
    } =
        useForm<CreateQuestionFormData>({
            resolver:
                joiResolver(
                    createQuestionSchema
                ),

            defaultValues: {
                questionText:
                    "",

                answerType:
                    AnswerType.SINGLE_SELECT,

                options: [
                    {
                        value: "",
                    },

                    {
                        value: "",
                    },
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

    const answerType =
        watch(
            "answerType"
        )

    const onSubmit =
        async (
            data: CreateQuestionFormData
        ) => {
            try {
                const payload = {
                    questionText:
                        data.questionText,

                    answerType:
                        data.answerType,

                    options:
                        data.answerType ===
                            AnswerType.TEXT
                            ? undefined
                            : data.options.map(
                                (
                                    option
                                ) =>
                                    option.value
                            ),
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

                reset()
            } catch (error) {
                console.log(
                    error
                )

                toast.error(
                    "Failed to create question"
                )
            }
        }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Create Question
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Add new questions to the question bank.
                </p>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>
                        Question Details
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
                                Question Text
                            </Label>

                            <Input
                                placeholder="Enter question..."
                                {
                                ...register(
                                    "questionText"
                                )
                                }
                            />

                            {
                                errors.questionText && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .questionText
                                                .message
                                        }
                                    </p>
                                )
                            }
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Answer Type
                            </Label>

                            <Controller
                                control={
                                    control
                                }

                                name="answerType"

                                render={({
                                    field,
                                }) => (
                                    <Select
                                        value={
                                            field.value
                                        }

                                        onValueChange={
                                            field.onChange
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
                                                Single Select
                                            </SelectItem>

                                            <SelectItem
                                                value={
                                                    AnswerType.MULTI_SELECT
                                                }
                                            >
                                                Multi Select
                                            </SelectItem>

                                            <SelectItem
                                                value={
                                                    AnswerType.TEXT
                                                }
                                            >
                                                Text
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {
                            answerType !==
                            AnswerType.TEXT && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>
                                            Options
                                        </Label>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                append({
                                                    value:
                                                        "",
                                                })
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />

                                            Add Option
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
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
                                                            variant="outline"
                                                            size="icon"
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
                                    </div>
                                </div>
                            )
                        }

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
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
        </div>
    )
}

export default CreateQuestion