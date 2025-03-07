import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { SUPABASE_BUCKET } from "~/lib/supabase/bucket";

export const profileRouter = createTRPCRouter({
  // function to get profile
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        bio: true,
        profilePictureUrl: true,
        username: true,
      },
    });

    return profile;
  }),

  // function to update profile
  updateProfile: privateProcedure
    .input(
      z.object({
        // TODO: sanitize username input
        username: z.string().min(3).max(16).toLowerCase().optional(),
        bio: z.string().max(300).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { username, bio } = input;

      if (username) {
        const usernameExist = await db.profile.findUnique({
          where: { username },
          select: { userId: true },
        });

        if (usernameExist && usernameExist.userId !== user?.id) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "USERNAME_USED",
          });
        }
      }

      const updatedUser = await db.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          username,
          bio,
        },
      });

      return updatedUser;
    }),

  /*************  ✨ Codeium Command 🌟  *************/
  updateProfilePicture: privateProcedure
    /**
     * Updates the user's profile picture.
     *
     * The `input` is the Base64 encoded string of the image file. The
     * `input` is optional because the user can choose to not upload a
     * profile picture.
     */
    .input(z.string().base64().optional())
    .mutation(async ({ ctx, input }) => {
      /**
       * Get the database and user context from the `ctx` object. The
       * `ctx` object is automatically passed to every mutation by tRPC.
       *
       * The `db` property is the Prisma client, which is used to interact
       * with the database.
       *
       * The `user` property is the currently authenticated user, who is
       * making the request.
       */
      const { db, user } = ctx;

      // Generate a unique timestamp for cache busting
      const timestamp = new Date().getTime().toString();

      // Define the file name for the uploaded avatar
      const fileName = `avatar-${user?.id}.jpeg`;

      if (input) {
        // Convert the Base64 input string into a Buffer
        const buffer = Buffer.from(input, "base64");

        // Upload the buffer to the Supabase storage bucket for profile pictures
        const { data, error } = await supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .upload(fileName, buffer, {
            contentType: "image/jpeg", // Specify the content type as JPEG
            upsert: true, // Allow overwriting of existing files
          });

        // Throw an error if the upload fails
        if (error) throw error;

        // Get the public URL of the uploaded image
        // Retrieve the public URL for the uploaded profile picture
        // 'data.path' contains the path of the uploaded file in the storage bucket
        const profilePictureUrl = supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .getPublicUrl(data.path);

        // Update the user's profile in the database with the new profile picture URL
        await db.profile.update({
          where: {
            // Specify the user by their unique user ID
            userId: user?.id,
          },
          data: {
            // Update the profilePictureUrl field with the new URL
            // Append a timestamp to the URL to prevent caching issues
            profilePictureUrl:
              profilePictureUrl.data.publicUrl + "?t=" + timestamp,
          },
        });
      }
    }),
  /******  a17d50b6-2311-4226-b3ee-34302757241e  *******/
});
