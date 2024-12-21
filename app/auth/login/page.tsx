'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Press_Start_2P } from "next/font/google";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import * as z from "zod";

const ps2 = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("O email é obrigatório"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    setIsLoading(false);

    if (res?.error) {
      form.setError("email", { message: "Email ou senha inválidos" });
    } else if (res?.ok) {
      router.push(res.url || "/");
    }
  };

  return (
    <div
      className={`${ps2.className} flex items-center justify-center h-[90%] bg-stone-300 text-white`}
    >
      <div className="w-[400px] p-6 rounded-lg shadow-lg bg-stone-800">
        <h2 className="text-amber-400 text-xl font-semibold mb-6 text-center">
          Welcome to Docuvision
        </h2>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm text-amber-400">
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-amber-400">
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full"
              {...form.register("password")} // Bind the input to react-hook-form
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-black"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-xs text-center">
          Don't have an account?{" "}
          <a href="register" className="text-amber-400 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
