import { ArrowRight, FileQuestionMark } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form"

import {
    joiResolver,
} from "@hookform/resolvers/joi"

import axios from "axios"

import Joi from "joi"

import { useDispatch } from "react-redux"

import { loginSuccess } from "@/redux/slices/authSlice"

import { toast } from "react-toastify"

import {
    useNavigate,
} from "react-router-dom"
import { BorderBeam } from "@/components/ui/border-beam"
import { AuroraText } from "@/components/ui/aurora-text"

interface LoginFormData {
    email: string

    password: string
}

const loginUserSchema =
    Joi.object({
        email: Joi.string()
            .trim()
            .lowercase()
            .email()
            .required()
            .messages({
                "string.empty":
                    "Email is required",

                "string.email":
                    "Invalid email format",
            }),

        password: Joi.string()
            .min(6)
            .max(20)
            .required()
            .trim()
            .messages({
                "string.empty":
                    "Password is required",
            }),
    })

const Login = () => {
    const navigate =
        useNavigate()

    const dispatch =
        useDispatch()

    const {
        register,
        handleSubmit,

        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormData>({
        resolver:
            joiResolver(
                loginUserSchema
            ),

        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit:
        SubmitHandler<LoginFormData> =
        async (
            data
        ) => {
            try {
                const response =
                    await axios.post(
                        "http://localhost:3000/api/users/login",
                        data
                    )

                dispatch(
                    loginSuccess({
                        user:
                            response.data.data.user,

                        token:
                            response.data.data.accessToken,
                    })
                )

                toast.success(
                    "Login successful"
                )

                const role =
                    response.data.data.user.role

                if (
                    role === "ADMIN"
                ) {
                    navigate(
                        "/admin/quizzes"
                    )
                } else {
                    navigate(
                        "/quizzes"
                    )
                }
            } catch (err) {
                console.log(err)

                toast.error(
                    "Invalid email or password"
                )
            }
        }

    return (
        <div className="flex min-h-screen items-center justify-center  px-4">
            <Card className="relative w-full max-w-md overflow-hidden border  shadow-sm pt-0">
                <BorderBeam duration={8} size={100} />
                <CardHeader className="border-b  px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                            <FileQuestionMark className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <CardTitle className="font-serif text-3xl font-semibold tracking-tight">
                                <AuroraText>
                                    QuizMaster
                                </AuroraText>
                            </CardTitle>

                            <CardDescription className="mt-1 text-sm text-slate-600">
                                Quiz Management Portal
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 py-2">
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                            >
                                Email Address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@quizmaster.com"
                                className="h-11"
                                {
                                ...register(
                                    "email"
                                )
                                }
                            />

                            {
                                errors.email && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .email
                                                .message
                                        }
                                    </p>
                                )
                            }
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                >
                                    Password
                                </Label>

                                <Button
                                    variant="link"
                                    type="button"
                                    className="text-xs  hover:underline"
                                >
                                    Forgot password?
                                </Button>
                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11"
                                {
                                ...register(
                                    "password"
                                )
                                }
                            />

                            {
                                errors.password && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .password
                                                .message
                                        }
                                    </p>
                                )
                            }
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting
                            }
                            className="h-11 w-full hover:bg-gray-700 transition duration-300"
                        >
                            {
                                isSubmitting
                                    ? "Logging in..."
                                    : "Login"
                            }

                            {
                                !isSubmitting && (
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                )
                            }
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?

                        <Button onClick={() => navigate("/register")} variant="link" className="hover:underline">
                            Register here
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default Login