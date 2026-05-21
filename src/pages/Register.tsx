import {
    ArrowRight,
    FileQuestionMark,
} from "lucide-react"

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

import { toast } from "react-toastify"

import {
    Link,
    useNavigate,
} from "react-router-dom"
import { BorderBeam } from "@/components/ui/border-beam"
import { LineShadowText } from "@/components/ui/line-shadow-text"
import { AuroraText } from "@/components/ui/aurora-text"
import { MagicCard } from "@/components/ui/magic-card"

interface RegisterFormData {
    name: string

    email: string

    password: string
}

const registerUserSchema =
    Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(30)
            .messages({
                "string.base":
                    "Name must be a string",

                "string.empty":
                    "Name is required",

                "string.min":
                    "Name must be at least 3 characters long",

                "string.max":
                    "Name cannot exceed 30 characters",

                "any.required":
                    "Name is required",
            }),

        email: Joi.string()
            .trim()
            .lowercase()
            .email()
            .required()
            .messages({
                "string.base":
                    "Email must be a string",

                "string.empty":
                    "Email is required",

                "string.email":
                    "Please enter a valid email address",

                "any.required":
                    "Email is required",
            }),

        password: Joi.string()
            .min(6)
            .max(20)
            .required()
            .messages({
                "string.base":
                    "Password must be a string",

                "string.empty":
                    "Password is required",

                "string.min":
                    "Password must be at least 6 characters long",

                "string.max":
                    "Password cannot exceed 20 characters",

                "any.required":
                    "Password is required",
            }),
    })

const Register = () => {
    const navigate =
        useNavigate()

    const {
        register,

        handleSubmit,

        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterFormData>({
        resolver:
            joiResolver(
                registerUserSchema
            ),

        defaultValues: {
            name: "",

            email: "",

            password: "",
        },
    })

    const onSubmit:
        SubmitHandler<RegisterFormData> =
        async (
            data
        ) => {
            try {
                await axios.post(
                    "http://localhost:3000/api/users/register",
                    data
                )

                toast.success(
                    "Registration successful"
                )

                navigate("/")
            } catch (err) {
                console.log(err)

                toast.error(
                    "Registration failed"
                )
            }
        }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="relative w-full max-w-md overflow-hidden border  shadow-sm py-0">
                <BorderBeam duration={8} size={100} />
                <MagicCard gradientColor="#262626">
                    <CardHeader className="border-b  px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border ">
                                <FileQuestionMark className="h-5 w-5 text-primary" />
                            </div>

                            <div>
                                <CardTitle className="font-serif text-3xl font-semibold tracking-tight">
                                    <AuroraText>
                                        QuizMaster
                                    </AuroraText>
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm">
                                    Create your account
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
                                <Label htmlFor="name">
                                    Full Name
                                </Label>

                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="h-11"
                                    {
                                    ...register(
                                        "name"
                                    )
                                    }
                                />

                                {
                                    errors.name && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors
                                                    .name
                                                    .message
                                            }
                                        </p>
                                    )
                                }
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email Address
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
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
                                <Label htmlFor="password">
                                    Password
                                </Label>

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
                                className="h-11 w-full"
                            >
                                {
                                    isSubmitting
                                        ? "Creating account..."
                                        : "Register"
                                }

                                {
                                    !isSubmitting && (
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    )
                                }
                            </Button>
                        </form>

                        <div className="mt-2 text-center text-sm">
                            Already have an account?
                            <Button
                                variant="link"
                                className=" hover:underline"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        </div>
                    </CardContent>
                </MagicCard>
            </Card>
        </div>
    )
}

export default Register