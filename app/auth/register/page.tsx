'use client';

import { useState } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Press_Start_2P } from "next/font/google";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertErrorMessage } from "@/components/AlertErrorMessage/page";

const ps2 = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is mandatory"),
  password: z.string().min(8, "The password must contain at least 8 characters"),
  username: z.string().min(1, "Username is mandatory"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  
  const [showAlert, setShowAlert] = useState(false);
  const [Message, setMessage] = useState("");
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("User created!")
        router.push("/auth/login");
      } else {
        setMessage(result.message)
        setShowAlert(true)
      }
    } catch (error) {
      setMessage("Error creating user." + error)
      setShowAlert(true)
    }
  };

  return (
    <div
      className={`${ps2.className} flex items-center justify-center h-[90%] bg-stone-300 text-white`}
    >
       <AlertErrorMessage message={Message} open={showAlert} displayFunction={setShowAlert} />
      <div className="w-[400px] p-6 rounded-lg shadow-lg bg-stone-800">
        <h2 className="text-amber-400 text-xl font-semibold mb-6 text-center">
          Create an Account
        </h2>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm text-amber-400">
              Username
            </label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
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
              {...form.register("password")}
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
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-xs text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-amber-400 underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
