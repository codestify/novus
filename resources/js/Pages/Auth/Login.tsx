import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@novus/Components/ui/input";
import { Button } from "@novus/Components/ui/button";
import useRoute from "@novus/hooks/useRoute";
import { useForm } from "@inertiajs/react";
import Logo from "@novus/Components/Logo";

const NovusLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const route = useRoute();
    const form = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(route("novus.auth.login"), {
            onFinish: () => form.reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900 items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="mb-8 text-center">
                    <Logo />
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium block text-gray-700 dark:text-gray-300"
                        >
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={form.data.email}
                            autoComplete="username"
                            onChange={(e) =>
                                form.setData({
                                    ...form.data,
                                    email: e.target.value,
                                })
                            }
                            className={`h-10 text-lg px-4 border rounded-md shadow-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                                form.errors.email
                                    ? "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500"
                                    : ""
                            }`}
                        />
                        {form.errors.email && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                                {form.errors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium block text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData({
                                        ...form.data,
                                        password: e.target.value,
                                    })
                                }
                                className={`h-10 text-lg px-4 border rounded-md shadow-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                                    form.errors.password
                                        ? "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500"
                                        : ""
                                }`}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        {form.errors.password && (
                            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                                {form.errors.password}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(e) =>
                                form.setData({
                                    ...form.data,
                                    remember: e.target.checked,
                                })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                            Remember me
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 cursor-pointer bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-sm uppercase text-white dark:text-black rounded-lg font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>
            {/*<div className="w-full max-w-4xl mx-auto p-4">*/}
            {/*    <div className="mb-4 flex justify-between items-center">*/}
            {/*        <h1 className="text-2xl font-bold">Create New Post</h1>*/}
            {/*        <Button onClick={handleSave} disabled={isSaving}>*/}
            {/*            {isSaving ? "Saving..." : "Save Post"}*/}
            {/*        </Button>*/}
            {/*    </div>*/}

            {/*    <div className="space-y-4">*/}
            {/*        <NovelEditor*/}
            {/*            initialContent={content}*/}
            {/*            onChange={setContent}*/}
            {/*            placeholder="Write your post content... Type / for commands"*/}
            {/*            className="min-h-[300px]"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default NovusLogin;
