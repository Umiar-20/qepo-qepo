import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
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
import { RegisterFormInner } from "../components/RegisterForm";
import {
  registerFormSchema,
  type TRegisterFormSchema,
} from "../forms/register";
import { toast } from "sonner";
import { supabase } from "~/lib/supabase/client";
import { type AuthError } from "@supabase/supabase-js";
import { SupabaseAuthErrorCode } from "~/lib/supabase/authErrorCodes";
import { useRouter } from "next/router";
import { GuestRoute } from "~/components/layout/GuestRoute";

export default function LoginPage() {
  /*************  ✨ Codeium Command 🌟  *************/
  // create a form context using the useForm hook from react-hook-form
  // useForm will automatically validate the form data against the schema
  // that we pass to it. In this case, we're using the registerFormSchema
  // zodResolver(registerFormSchema) digunakan untuk melakukan validasi form dengan bantuan Zod.
  // zodResolver() adalah adapter yang menghubungkan React Hook Form dengan Zod.
  // registerFormSchema adalah skema validasi yang telah didefinisikan dengan Zod.
  const form = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });
  // /******  e932aa6a-81ae-46f1-9a89-accb25ddf334  *******/

  const router = useRouter();

  // Fungsi `handleLoginSubmit` digunakan untuk menangani proses login pengguna.
  // Fungsi ini bersifat async karena melakukan permintaan ke Supabase untuk otentikasi pengguna.
  const handleLoginSubmit = async (values: TRegisterFormSchema) => {
    try {
      // Menggunakan Supabase untuk mencoba login dengan email dan password yang diberikan.
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email, // Menggunakan email yang diinput oleh pengguna.
        password: values.password, // Menggunakan password yang diinput oleh pengguna.
      });

      // Jika terjadi error saat login, lempar error agar bisa ditangkap di blok catch.
      if (error) throw error;

      // Jika login berhasil, arahkan pengguna ke halaman utama ("/").
      await router.replace("/");
    } catch (error) {
      // Menangani berbagai kemungkinan error autentikasi dari Supabase.
      switch ((error as AuthError).code) {
        // Jika email atau password salah, tampilkan pesan error pada form input.
        case SupabaseAuthErrorCode.invalid_credentials:
          form.setError("email", { message: "Invalid email or password" });
          form.setError("password", { message: "Invalid email or password" });
          break;

        // Jika email pengguna belum dikonfirmasi, tampilkan pesan error di input email.
        case SupabaseAuthErrorCode.email_not_confirmed:
          form.setError("email", { message: "Email not verified" });
          break;

        // Jika terjadi error lain yang tidak diketahui, tampilkan notifikasi kesalahan.
        default:
          toast.error("Something went wrong, please try again later.");
      }
    }
  };

  return (
    <GuestRoute>
      <PageContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] w-full flex-col justify-center"
        >
          <Card className="w-full max-w-[480px] self-center">
            {/* start of card header */}
            <CardHeader className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-primary">
                Welcome back to Qepo!
              </h1>
              <p className="text-muted-foreground">
                kata-kata hari ini Pak Subur?
              </p>
            </CardHeader>
            {/* end of card header */}

            {/* start of card content */}
            <CardContent>
              {/* start of continue with google */}
              <Form {...form}>
                <RegisterFormInner
                  // isLoading={registerUserIsPending}
                  onRegisterSubmit={handleLoginSubmit}
                  buttonText="Log in"
                />
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
                  or continue
                </p>
                <div className="h-[2px] w-full border-t-2" />
              </div>
              {/* end of separator */}

              {/* start of google button */}
              <Button variant="secondary" size="lg" className="w-full">
                <FaGoogle />
                Log in with Google
              </Button>
              {/* end of google button */}

              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-indigo-400 hover:text-indigo-600"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
            {/* end of card footer */}
          </Card>
        </SectionContainer>
      </PageContainer>
    </GuestRoute>
  );
}
