import React, { useState } from "react";
import { Button } from "~/components/ui/button";
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
import { useFormContext } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";

type TRegisterFormProps = {
  onRegisterSubmit: (values: TRegisterFormSchema) => void;
};

export const RegisterFormInner = (props: TRegisterFormProps) => {
  const form = useFormContext<TRegisterFormSchema>();

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
      {/* start of show password checkbox */}
      <Label className="flex items-center gap-2">
        <Checkbox
          checked={showPassword}
          onCheckedChange={(checked) => setShowPassword(!!checked)}
        />
        Show password
      </Label>
      {/* end of show password checkbox */}
      {/* end of password field */}

      {/* start of button */}
      <Button className="mt-4 w-full">Create account</Button>
      {/* end of button */}
    </form>
  );
};
