import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import {
  type ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

const ProfilePage = () => {
  // State to hold the selected image file
  // `selectedImage` is a state variable that stores the user's selected image
  // file. This variable is used to keep track of whether the user has selected
  // an image file to upload to the server. The state variable is initialized
  // to `null` which means that no image has been selected by the user.
  //
  // The type of `selectedImage` is `File | undefined | null`. This is a union
  // type that can be either a `File` object, `undefined`, or `null`.
  // `File` is a type that represents a file object that is used to store
  // information about a file on the user's device. `undefined` is a type that
  // represents an uninitialized or nonexistent value. `null` is a type that
  // represents the intentional absence of any object value.
  //
  // The `setSelectedImage` function is a state setter function that is used to
  // update the `selectedImage` state variable. This function takes a single
  // argument of type `File | undefined | null` and sets the `selectedImage`
  // state variable to that value.
  const [selectedImage, setSelectedImage] = useState<File | undefined | null>(
    null,
  );

  // Utility hooks for managing API cache
  // Get the API utility functions from the `api` object. The `api` object is
  // an instance of the `api` hook returned by the `createTRPCNext` function.
  // The `api` object has a `useUtils` method that returns an object with utility
  // functions that can be used to interact with the API.
  //
  // The `useUtils` method returns an object with the following properties:
  // - `getQueryCache`: A function that returns the cache for a specific query.
  // - `invalidateQueryCache`: A function that invalidates the cache for a
  //   specific query.
  // - `prefetchQuery`: A function that prefetches a query.
  // - `useMutation`: A hook that returns a function that can be used to send
  //   a mutation to the server.
  // - `useQuery`: A hook that returns a function that can be used to send a
  //   query to the server.
  const apiUtils = api.useUtils();

  // Initialize the form using react-hook-form and zod validation schema
  // Initialize the form using react-hook-form and zod validation schema.
  // The `resolver` is set to `zodResolver(editProfileFormSchema)` which
  // means that the form will use the `editProfileFormSchema` zod schema
  // to validate and parse the form data.
  //
  // The `editProfileFormSchema` schema is defined in the `../forms/edit-profile.ts`
  // file and is used to validate the form data.
  //
  // The `useForm` hook will return an object with the following properties:
  // * `register`: a function to register the form fields
  // * `handleSubmit`: a function to handle form submission
  // * `formState`: an object containing information about the form state
  // * `errors`: an object containing validation errors
  // * `reset`: a function to reset the form state
  const form = useForm<TEditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
  });

  // Fetch the user profile data from the API
  // Fetch the user profile data from the API
  // The `useQuery` hook is called on the `getProfile` procedure of the `profile` router.
  // The `useQuery` hook returns an object with the following properties:
  // - `data`: the data returned by the procedure
  // - `error`: an error object if the procedure fails
  // - `isLoading`: a boolean indicating if the procedure is currently loading
  // - `isSuccess`: a boolean indicating if the procedure has successfully completed
  // - `isError`: a boolean indicating if the procedure has failed
  // - `refetch`: a function to refetch the data from the procedure
  // - `refetchOnWindowFocus`: a boolean indicating if the procedure should refetch
  //   when the window regains focus
  // - `refetchOnReconnect`: a boolean indicating if the procedure should refetch
  //   when the connection is re-established
  // - `refetchInterval`: a number indicating how often the procedure should refetch
  //   in milliseconds
  // The `useQuery` hook is memoized, meaning that the same hook will return the same
  // object until the component is re-rendered.
  // The `data` property of the returned object is typed as `T | undefined` where `T` is the type
  // of the data returned by the procedure. In this case, the type of `getProfileData` is
  // `GetProfileOutput | undefined`.
  const { data: getProfileData } = api.profile.getProfile.useQuery();

  // Mutation to update profile information (username and bio)
  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async ({ bio, username }) => {
      // Reset form values after successful update
      form.reset({ bio: bio ?? "", username });
      toast.success("Profile successfully updated");
    },
    onError: (err) => {
      // Check if the error is an instance of TRPCClientError
      if (err instanceof TRPCClientError) {
        // If the error message indicates that the username is already used
        if (err.message === "USERNAME_USED") {
          // Set a form error on the username field with a specific message
          form.setError("username", { message: "Username is already taken" });
        }
      }
      // Show a toast notification indicating the profile update failed
      toast.error("Failed to update profile");
    },
  });

  // Mutation to update the profile picture
  const updateProfilePicture = api.profile.updateProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Profile picture updated successfully");
      setSelectedImage(null);
      await apiUtils.profile.getProfile.invalidate(); // Refresh the profile data
    },
    onError: async () => {
      toast.error("Failed to update profile picture");
    },
  });

  // Reference to the hidden file input element
  // This `inputFileRef` is a reference to the hidden file input element, which is used
  // to trigger the file selection dialog when the user clicks on the "Change Photo"
  // button.
  // The file input element is hidden because we want to show a styled button instead
  // of the default file input element.
  // The `useRef` hook is used to create a reference to the element, which is then
  // passed to the `onPickProfilePicture` function as an argument.
  // The `useRef` hook returns an object with a single property, `current`, which is
  // the actual reference to the element.
  // The `inputFileRef` is initialized with a value of `null`, which means that it
  // will be set to the element when the component is mounted.
  // The `inputFileRef` is typed as `React.MutableRefObject<HTMLInputElement>`,
  // which means that it is a mutable reference to an `HTMLInputElement`.
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Handle profile form submission
  /**
   * Handle profile form submission.
   *
   * This function takes the form values as an argument and creates a payload
   * object to be sent to the server. The payload object contains only the fields
   * that have changed from the original data.
   *
   * @param {TEditProfileFormSchema} values - Form values
   */
  const handleUpdateProfileSubmit = (values: TEditProfileFormSchema) => {
    /**
     * Create a payload object to be sent to the server. This object will contain
     * only the fields that have changed from the original data.
     */
    const payload: { username?: string; bio?: string } = {};

    /**
     * Check if the username has changed. If it has, add it to the payload object.
     */
    if (values.username !== getProfileData?.username) {
      payload.username = values.username;
    }

    /**
     * Check if the bio has changed. If it has, add it to the payload object.
     */
    if (values.bio !== getProfileData?.bio) {
      payload.bio = values.bio;
    }

    /**
     * Call the `updateProfile` mutation with the payload object.
     */
    updateProfile.mutate(payload);
  };

  // Open file selection dialog when "Change Photo" is clicked
  /**
   * Handle the "Change Photo" button click event.
   *
   * This function is called when the user clicks on the "Change Photo" button.
   * It simulates a click event on the hidden file input element, which will
   * open the file explorer dialog.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
   */
  const handleOpenFileExplorer = () => {
    /**
     * Get the hidden file input element.
     *
     * The `inputFileRef` is a reference to the hidden file input element, which
     * is created by the `useRef` hook.
     *
     * The `current` property of the `inputFileRef` is the actual element, which
     * is an `HTMLInputElement`.
     *
     * We use the optional chaining operator (`?.`) to access the `current`
     * property because the `inputFileRef` might be null if the component is
     * not yet mounted.
     */
    const fileInputElement = inputFileRef.current;

    /**
     * Simulate a click event on the file input element.
     *
     * This will open the file explorer dialog.
     */
    fileInputElement?.click();
    inputFileRef.current?.click();
  };

  // Remove the selected image from state
  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
  };

  // Handle file selection for profile picture
  /**
   * Handle the file selection event for the profile picture.
   *
   * When the user selects a new profile picture, the file selection event is
   * triggered. This function is called when that event is triggered.
   *
   * The function takes an event object as an argument, which is an instance of
   * `ChangeEvent<HTMLInputElement>`. This event object contains the selected
   * file, which is accessed using the `target.files` property.
   *
   * If the `target.files` property is not null, it means that the user has
   * selected a file. In that case, the first file in the `target.files`
   * array is taken and set as the new `selectedImage` state.
   *
   * The `selectedImage` state is used to store the selected file, which is
   * then used to display a preview of the selected image.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The event object
   */
  const onPickProfilePicture: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Convert the selected image to Base64 and upload it
  /**
   * Handle the event when the user clicks on the "Update Profile Picture" button.
   *
   * This function is called when the user clicks on the "Update Profile Picture"
   * button. It is responsible for converting the selected image to a Base64
   * string and then calling the `updateProfilePicture` mutation with the
   * Base64 string as an argument.
   *
   * The function takes no arguments.
   */
  const handleUpdateProfilePicture = async () => {
    /**
     * If the user has selected an image, proceed with the upload process.
     *
     * If the user has not selected an image, do nothing.
     */
    if (selectedImage) {
      /**
       * Create a new `FileReader` object.
       *
       * The `FileReader` object is used to read the contents of the selected
       * image file.
       */
      const reader = new FileReader();

      /**
       * Define a function to be called when the `FileReader` object has finished
       * reading the file.
       *
       * This function is called when the `FileReader` object has finished reading
       * the file. It takes no arguments.
       */
      reader.onloadend = function () {
        /**
         * Get the result of the file read operation.
         *
         * The `result` is a string that contains the contents of the file. It
         * is either a Base64 string or a URL.
         */
        const result = reader.result as string;

        /**
         * Extract the Base64 string from the result.
         *
         * The Base64 string is the part of the result that comes after the
         * first comma. We use the `substring` method to extract this part.
         */
        const imageBase64 = result.substring(result.indexOf(",") + 1);

        /**
         * Call the `updateProfilePicture` mutation with the extracted Base64
         * string as an argument.
         *
         * The `updateProfilePicture` mutation is a TRPC mutation that updates
         * the user's profile picture.
         */
        updateProfilePicture.mutate(imageBase64);
      };

      /**
       * Read the selected image file as a Data URL.
       *
       * The `readAsDataURL` method of the `FileReader` object reads the contents
       * of the selected image file as a Data URL.
       */
      reader.readAsDataURL(selectedImage);
    }
  };

  // Generate a preview URL for the selected profile picture
  /**
   * Generate a preview URL for the selected profile picture.
   *
   * When the user selects a new profile picture, we want to display a preview
   * of the selected image. To do this, we use the `URL.createObjectURL`
   * method to generate a URL that points to the selected image.
   *
   * The `URL.createObjectURL` method takes a `File` object as an argument and
   * returns a URL that points to the file. We use this method to generate a
   * URL that points to the selected image.
   *
   * We store the generated URL in the `selectedProfilePicturePreview` state
   * variable. This variable is memoized using the `useMemo` hook, which means
   * that it will only be recomputed when the `selectedImage` state variable
   * changes.
   *
   * We use the `useMemo` hook to memoize the `selectedProfilePicturePreview`
   * state variable so that it is not recomputed unnecessarily. This helps to
   * improve performance by avoiding unnecessary computations.
   */
  const selectedProfilePicturePreview = useMemo(() => {
    if (selectedImage) {
      // Generate a URL that points to the selected image
      return URL.createObjectURL(selectedImage);
    }
  }, [selectedImage]);

  // Populate form fields with fetched profile data
  useEffect(() => {
    /**
     * Check if the profile data has been fetched successfully.
     *
     * The `getProfileData` object contains the user's profile information
     * fetched from the server. We check if this object is not null or undefined
     * to ensure that the profile data is available before proceeding.
     */
    if (getProfileData) {
      /**
       * Set the form's username field with the fetched username.
       *
       * The `setValue` method from the form context is used to update the
       * form's field values. Here, we update the "username" field with the
       * username obtained from the `getProfileData` object. If the username
       * is null or undefined, an empty string is used as a fallback.
       */
      form.setValue("username", getProfileData.username ?? "");

      /**
       * Set the form's bio field with the fetched bio.
       *
       * Similarly, we update the "bio" field in the form with the bio
       * obtained from the `getProfileData` object. If the bio is null or
       * undefined, an empty string is used as a fallback.
       */
      form.setValue("bio", getProfileData.bio ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfileData]);

  return (
    <AuthRoute>
      <PageContainer>
        <SectionContainer padded minFullScreen className="gap-y-6 py-8">
          <h1 className="text-3xl font-semibold">Profile Settings</h1>

          <Card>
            <CardContent className="flex gap-6 pt-6">
              <div className="flex flex-col gap-2">
                <Avatar className="size-24">
                  <AvatarFallback>VF</AvatarFallback>
                  <AvatarImage
                    src={
                      selectedProfilePicturePreview ??
                      getProfileData?.profilePictureUrl ??
                      ""
                    }
                  />
                </Avatar>

                <Button
                  variant="secondary"
                  onClick={handleOpenFileExplorer}
                  size="sm"
                >
                  Change Photo
                </Button>
                {!!selectedImage && (
                  <>
                    <Button
                      onClick={handleRemoveSelectedImage}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                    <Button onClick={handleUpdateProfilePicture} size="sm">
                      Save
                    </Button>
                  </>
                )}
                <input
                  accept="image/*"
                  onChange={onPickProfilePicture}
                  className="hidden"
                  type="file"
                  ref={inputFileRef}
                />
              </div>

              <div className="grid flex-1 grid-cols-2 gap-y-4">
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
            </CardContent>
          </Card>

          <div className="flex w-full justify-end gap-4">
            <Button
              disabled={!form.formState.isDirty}
              onClick={form.handleSubmit(handleUpdateProfileSubmit)}
            >
              Save
            </Button>
          </div>
        </SectionContainer>
      </PageContainer>
    </AuthRoute>
  );
};

export default ProfilePage;
