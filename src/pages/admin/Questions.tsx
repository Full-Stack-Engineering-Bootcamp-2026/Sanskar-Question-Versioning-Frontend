import {
    useEffect,
    useMemo,
    useState,
} from "react"

import axios from "axios"

import { toast } from "react-toastify"

import {
    Link,
} from "react-router-dom"

import {
    Search,
    Eye,
    Pencil,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

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
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/stores/store"

interface Question {
    publicId: string

    questionText: string

    answerType: string

    versionNumber: number
}

const Questions = () => {
    const [questions,
        setQuestions] =
        useState<Question[]>([])

    const [search,
        setSearch] =
        useState("")

    const [isLoading,
        setIsLoading] =
        useState(false)

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchQuestions =
        async () => {
            try {
                setIsLoading(true)

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
            } catch (error) {
                console.log(error)

                toast.error(
                    "Failed to fetch questions"
                )
            } finally {
                setIsLoading(false)
            }
        }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const filteredQuestions =
        useMemo(() => {
            return questions.filter(
                (
                    question
                ) =>
                    question.questionText
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            )
        }, [
            questions,
            search,
        ])

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Questions
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage question bank and versions.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b">
                    <CardTitle>
                        Question Bank
                    </CardTitle>

                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                placeholder="Search questions..."
                                className="pl-9"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <Button asChild>
                            <Link to="/admin/questions/create">
                                Create Question
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Question
                                </TableHead>

                                <TableHead>
                                    Type
                                </TableHead>

                                <TableHead>
                                    Version
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
                                            Loading questions...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredQuestions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            No questions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredQuestions.map(
                                        (
                                            question
                                        ) => (
                                            <TableRow
                                                key={
                                                    question.publicId
                                                }
                                            >
                                                <TableCell className="max-w-125 truncate font-medium">
                                                    {
                                                        question.questionText
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                    >
                                                        {
                                                            question.answerType
                                                                .replaceAll(
                                                                    "_",
                                                                    " "
                                                                )
                                                        }
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    v
                                                    {
                                                        question.versionNumber
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
                                                                to={`/admin/questions/${question.publicId}/versions`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                to={`/admin/questions/${question.publicId}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
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

export default Questions