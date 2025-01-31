import React from "react";
import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import {
  type TRegisterFormSchema,
  registerFormSchema,
} from "../forms/register";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RegisterFormInner } from "../components/RegisterForm";

export default function RegisterPage() {
  const form = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  const handleRegisterSubmit = (values: TRegisterFormSchema) => {
    alert("form submitted");
  };

  return (
    <PageContainer>
      <SectionContainer
        padded
        className="flex min-h-[calc(100vh-144px)] w-full flex-col justify-center"
      >
        <Card className="w-full max-w-[480px] self-center">
          {/* start of card header */}
          <CardHeader className="flex flex-col items-center justify-center">
            {/* start od icon */}
            {/* end of icon */}
            <h1 className="text-2xl font-bold text-primary">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              join our community to get started
            </p>
          </CardHeader>
          {/* end of card header */}

          {/* start of card content */}
          <CardContent>
            {/* start of continue with google */}
            <Form {...form}>
              <RegisterFormInner onRegisterSubmit={handleRegisterSubmit} />
            </Form>
            {/* end of continue with google */}
          </CardContent>
          {/* end of card content */}

          {/* start of card footer */}
          <CardFooter className="flex flex-col gap-4">
            {/* start of separator */}
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="h-[2px] w-full border-t-2" />
              <p className="flex-1 text-nowrap text-muted-foreground">
                or continue with
              </p>
              <div className="h-[2px] w-full border-t-2" />
            </div>
            {/* end of separator */}

            {/* start of google button */}
            <Button variant="secondary" size="lg" className="w-full">
              <FcGoogle />
              Sign up with Google
            </Button>
            {/* end of google button */}

            <p>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-600"
              >
                Login
              </Link>
            </p>
          </CardFooter>
          {/* end of card footer */}
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
