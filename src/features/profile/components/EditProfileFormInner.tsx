import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type TEditProfileFormSchema } from "../forms/edit-profile";

type TProps = {
  defaultValues: {
    username?: string;
    bio?: string | null;
  };
};

export const EditProfileFormInner = (props: TProps) => {
  const form = useFormContext<TEditProfileFormSchema>();

  return (
    <>
      {/* start of username field */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* end of username field */}

      {/* start of bio field */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* end of bio field */}
    </>
  );
};
