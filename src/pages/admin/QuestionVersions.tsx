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
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import { AuroraText } from "@/components/ui/aurora-text"
import { TypingAnimation } from "@/components/ui/typing-animation"

interface Option {
    publicId: string

    optionText: string
}

interface QuestionVersion {
    publicId: string

    versionNumber: number

    questionText: string

    answerType: string

    createdAt: string

    options: Option[]
}

const QuestionVersions = () => {
    const { publicId } =
        useParams()

    const [versions,
        setVersions] =
        useState<
            QuestionVersion[]
        >([])

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchVersions =
        async () => {
            try {
                setIsLoading(true)

                const response =
                    await axios.get(
                        `http://localhost:3000/api/questions/${publicId}/versions`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    )

                setVersions(
                    response.data.data
                )
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch versions"
                )
            } finally {
                setIsLoading(false)
            }
        }

    useEffect(() => {
        fetchVersions()
    }, [])

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    <AuroraText>
                        <TypingAnimation>
                            Question Versions
                        </TypingAnimation>
                    </AuroraText>
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    View all historical versions of the question.
                </p>
            </div>

            {
                isLoading ? (
                    <div>
                        Loading versions...
                    </div>
                ) : versions.length === 0 ? (
                    <div>
                        No versions found
                    </div>
                ) : (
                    versions.map(
                        (
                            version,
                            index
                        ) => (
                            <Card
                                key={
                                    version.publicId
                                }
                            >
                                <CardHeader className="border-b">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>
                                            Version
                                            {" "}
                                            {
                                                version.versionNumber
                                            }
                                        </CardTitle>

                                        {
                                            index === 0 && (
                                                <Badge>
                                                    Latest
                                                </Badge>
                                            )
                                        }
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 pt-6">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Question Text
                                        </p>

                                        <div className="rounded-md border bg-muted/30 p-4">
                                            {
                                                version.questionText
                                            }
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Answer Type
                                        </p>

                                        <Badge
                                            variant="secondary"
                                        >
                                            {
                                                version.answerType
                                                    .replaceAll(
                                                        "_",
                                                        " "
                                                    )
                                            }
                                        </Badge>
                                    </div>

                                    {
                                        version.options &&
                                        version.options.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Options
                                                </p>

                                                <div className="space-y-2">
                                                    {
                                                        version.options.map(
                                                            (
                                                                option
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        option.publicId
                                                                    }
                                                                    className="rounded-md border bg-muted/30 px-4 py-2 text-sm"
                                                                >
                                                                    {
                                                                        option.optionText
                                                                    }
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className="text-xs text-muted-foreground">
                                        Created:
                                        {" "}
                                        {
                                            new Date(
                                                version.createdAt
                                            ).toLocaleString()
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )
                )
            }
        </div>
    )
}

export default QuestionVersions