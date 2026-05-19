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
import { useForm, type SubmitHandler } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import axios from "axios"
import Joi from "joi"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/redux/slices/authSlice"
interface LoginFormData {
    email: string
    password: string
}
const Login = () => {
    const dispatch = useDispatch();
    const loginUserSchema = Joi.object({
        email: Joi.string()
            .trim()
            .lowercase()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format",
            }),

        password: Joi.string()
            .min(6)
            .max(20)
            .required()
            .trim()
            .messages({
                "string.empty": "Password is required",
            }),
    })
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: joiResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/users/login",
                data
            )
            dispatch(loginSuccess({
                user: response.data.data.user,
                token: response.data.data.accessToken
            }))
            console.log("Login Success");
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
            <Card className="w-full max-w-md overflow-hidden border border-gray-300 shadow-sm rounded-md p-0 gap-0">
                <CardHeader className="border-b bg-[#f2f4ff] px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-blue-600">
                            <FileQuestionMark className="h-4 w-4 text-blue-600" />
                        </div>

                        <CardTitle className="text-3xl font-semibold tracking-tight font-serif">
                            QuizMaster
                        </CardTitle>
                    </div>

                    <CardDescription className="mt-2 text-sm text-gray-600">
                        Internal Management Portal
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 py-8">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@quizmaster.com"
                                className="h-11 rounded-sm border-gray-300 bg-white"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.email
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </Label>

                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Forgot?
                                </button>
                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 rounded-sm border-gray-300 bg-white"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors
                                            .password
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full rounded-sm bg-blue-700 text-sm font-medium hover:bg-blue-800"
                        >
                            {isSubmitting
                                ? "Logging in..."
                                : "Login"}

                            {!isSubmitting && (
                                <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-600">
                        Need assistance?{" "}
                        <button className="text-blue-600 hover:underline">
                            Contact System Admin
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login