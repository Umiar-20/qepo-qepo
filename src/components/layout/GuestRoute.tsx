// Import necessary dependencies
import { useRouter } from "next/router"; // Next.js router for client-side navigation
import { type PropsWithChildren, useEffect } from "react"; // Import React's useEffect hook for side effects
import { supabase } from "~/lib/supabase/client"; // Import Supabase client for authentication

export const GuestRoute = (props: PropsWithChildren) => {
  // Initialize Next.js router to handle client-side navigation
  const router = useRouter();

  useEffect(() => {
    /**
     * Immediately Invoked Async Function Expression (IIFE)
     *
     * - Since `useEffect` does not directly support async functions, we wrap it inside an IIFE.
     * - This ensures that the authentication check runs as soon as the component mounts.
     */
    void (async function () {
      // Fetch the currently authenticated user from Supabase
      const { data } = await supabase.auth.getUser();

      // If the user exists and no error occurred, they are already logged in
      if (data.user) {
        // Redirect them to the homepage (`"/"`) to prevent access to guest-only pages
        await router.replace("/");
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user is NOT logged in, render the child components (i.e., the guest-only page content)
  return props.children;
};
