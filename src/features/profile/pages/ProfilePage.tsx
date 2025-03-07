import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthRoute } from "~/components/layout/AuthRoute";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { api } from "~/utils/api";
import { EditProfileFormInner } from "../components/EditProfileFormInner";
import {
  editProfileFormSchema,
  type TEditProfileFormSchema,
} from "../forms/edit-profile";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";

const ProfilePage = () => {
  const form = useForm<TEditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
  });

  const { data: getProfileData } = api.profile.getProfile.useQuery();

  const updatedProfile = api.profile.updateProfile.useMutation({
    onSuccess: async ({ bio, username }) => {
      form.reset({ bio: bio ?? "", username: username ?? "" });
      toast.success("You successfully updated your profile!");
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        if (err.message === "USERNAME_USED") {
          form.setError("username", { message: "Username already taken" });
        }
      }

      toast.error("Failed to update profile");
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfileSubmit = (values: TEditProfileFormSchema) => {
    updatedProfile.mutate(values);
  };

  // const hasProfileChanged = getProfileData?.username !== form.watch("username") || getProfileData?.bio !== form.watch("bio");

  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click();
  };

  useEffect(() => {
    if (getProfileData) {
      form.setValue("username", getProfileData.username ?? "");
      form.setValue("bio", getProfileData.bio ?? "");
    }
  }, [getProfileData]);

  return (
    <AuthRoute>
      <PageContainer>
        <SectionContainer padded minFullScreen className="gap-y-6 py-8">
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
          <Card>
            <CardContent className="flex gap-6 pt-6">
              {/* start of avatar */}
              <div className="flex flex-col gap-2">
                <Avatar className="size-24">
                  <AvatarImage />
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <Button size="sm" onClick={handleOpenFileExplorer}>
                  <span>Edit Photo</span>
                </Button>
                <input className="hidden" type="file" ref={inputFileRef} />
              </div>
              {/* end of avatar */}

              {/* start of form */}
              <div className="grid flex-1 grid-cols-2 gap-y-4">
                {/* 
                This is the data that we get from the getProfile query.
                If the data is available, then we render the EditProfileFormInner
                component and pass the data as default values.
              */}
                {getProfileData && (
                  <Form {...form}>
                    <EditProfileFormInner
                      defaultValues={{
                        bio: getProfileData?.bio,
                        username: getProfileData?.username,
                      }}
                    />
                  </Form>
                )}
              </div>
              {/* end of form */}
            </CardContent>
          </Card>
          {/* Start of Button */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={form.handleSubmit(handleUpdateProfileSubmit)}
              className="px-8"
              disabled={!form.formState.isDirty} // Disable if no changes
            >
              Save
            </Button>
          </div>
          {/* End of Button */}
        </SectionContainer>
      </PageContainer>
    </AuthRoute>
  );
};

export default ProfilePage;
