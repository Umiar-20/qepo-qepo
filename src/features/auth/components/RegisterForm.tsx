import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type TRegisterFormSchema } from "../forms/register";

type TRegisterFormProps = {
  onRegisterSubmit: (values: TRegisterFormSchema) => void;
  isLoading?: boolean;
  buttonText?: string;
  showPassword?: boolean;
};

export const RegisterFormInner = (props: TRegisterFormProps) => {
  /*************  ✨ Codeium Command 🌟  *************/
  // Use the useFormContext hook to access the form context
  // The generic type TRegisterFormSchema is used to ensure type safety
  // This allows us to access form methods like handleSubmit, control etc.
  const form = useFormContext<TRegisterFormSchema>();
  // /******  8dd3f727-8b7a-44d0-ad52-77ab07336904  *******/

  // untuk show password pada form password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form
      onSubmit={form.handleSubmit(props.onRegisterSubmit)}
      className="flex flex-col gap-y-1"
    >
      {/* start of email field */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      {/* end of email field */}
      {/* start of password field */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type={showPassword ? "text" : "password"} {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      {/* end of password field */}

      {/* start of show password checkbox */}
      {props.showPassword && (
        <Label className="flex items-center gap-2">
          <Checkbox
            checked={showPassword}
            onCheckedChange={(checked) => setShowPassword(!!checked)}
          />
          Show password
        </Label>
      )}
      {/* end of show password checkbox */}

      {/* start of button */}
      <Button disabled={props.isLoading} className="mt-4 w-full">
        {props.buttonText ?? "Create account"}
      </Button>
      {/* end of button */}
    </form>
  );
};
