import { useRef } from "react";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/utils/api";
import { EditProfileFormInner } from "../components/EditProfileFormInner";
import { AuthRoute } from "~/components/layout/AuthRoute";

const ProfilePage = () => {
  const { data: getProfileData } = api.profile.getProfile.useQuery();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click();
  };

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
                  <EditProfileFormInner
                    defaultValues={{
                      bio: getProfileData?.bio,
                      username: getProfileData?.username,
                    }}
                  />
                )}
              </div>
              {/* end of form */}
            </CardContent>
          </Card>
          {/* Start of Button */}
          <div className="flex justify-end gap-4">
            <Button className="px-8">Save</Button>
          </div>
          {/* End of Button */}
        </SectionContainer>
      </PageContainer>
    </AuthRoute>
  );
};

export default ProfilePage;
