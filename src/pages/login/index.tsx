import { useRouter } from "next/router";
import { useForm, Controller, SubmitHandler, set } from "react-hook-form";
import { AdminLoginLayout } from "@/layouts/AdminLoginLayout";
import { ApiLogin } from "@/apis/auth";
import { TextInput } from "@mantine/core";
import { setCookie } from "cookies-next";

interface LoginForm {
    email: string;
    password: string;
}

const AdminLogin = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const handleLogin: SubmitHandler<LoginForm> = async (data) => {
        try {
            const res = await ApiLogin(data);

            if (res?.data?.user?.id) {
                const user = {
                    id: res?.data?.user?.id,
                    email: res?.data?.user?.email,
                    username: res?.data?.user?.username,
                    role: res?.data?.user?.role || "ADMIN",
                };
                // Set cookies for token and user
                setCookie("token", res?.data?.accessToken);
                setCookie("user", JSON.stringify(user));
                setCookie("role", res?.data?.user?.role);

                router.push("/dashboard");
            } else {
                alert("Wrong credentials");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="flex items-center justify-center mt-28 ">
            <div className="w-full max-w-md p-8">
               <h2 className="text-center">
  <img
    src="/damipasal.png" // replace with your logo path
    alt="Dami Pasal Logo"
    className="h-12 w-auto mx-auto"
  />
</h2>


                {errors.email && (
                    <div className=" text-red-600">{errors.email.message}</div>
                )}

                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="mt-4">
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Username is required" }}
                            render={({ field }) => (
                                <TextInput
                                    type="email"
                                    id="username"
                                    {...field}
                                    className="w-full px-4 py-2 border rounded "
                                    placeholder="Enter your username"
                                />
                            )}
                        />
                        {errors.email && (
                            <div className="text-red-600">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Password is required" }}
                            render={({ field }) => (
                                <TextInput
                                    type="password"
                                    id="password"
                                    {...field}
                                    className="w-full px-4 py-2 border rounded "
                                    placeholder="Enter your password"
                                />
                            )}
                        />
                        {errors.password && (
                            <div className="text-red-600">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded "
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
AdminLogin.getLayout = (page: any) => (
    <AdminLoginLayout>{page}</AdminLoginLayout>
);
