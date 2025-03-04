// Import necessary dependencies
import { useRouter } from "next/router"; // Next.js router for client-side navigation
import { type PropsWithChildren, useEffect } from "react"; // Import React's useEffect hook for side effects
import { supabase } from "~/lib/supabase/client"; // Import Supabase client for authentication

/**
 * `GuestRoute` is a **higher-order component (HOC)** that wraps pages accessible **only by guest users**.
 * If a user is logged in, they will be **automatically redirected** to the homepage (`"/"`).
 * If not logged in, the wrapped content (`props.children`) will be rendered.
 *
 * @param {PropsWithChildren} props - The child components that will be displayed if the user is NOT logged in.
 * @returns The `props.children` if the user is not authenticated, otherwise it redirects to `/`.
 */
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
      try {
        // Fetch the currently authenticated user from Supabase
        const { data: user, error } = await supabase.auth.getUser();

        // If the user exists and no error occurred, they are already logged in
        if (user && !error) {
          // Redirect them to the homepage (`"/"`) to prevent access to guest-only pages
          await router.replace("/");
        }
      } catch (err) {
        // Handle unexpected errors (e.g., network issues, Supabase errors)
        console.error("Error checking authentication status:", err);
      }
    })();

    // Disabling ESLint warning because we **intentionally** do not include `router` as a dependency.
    // Adding `router` would cause unnecessary re-runs of `useEffect` and may lead to unintended redirects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user is NOT logged in, render the child components (i.e., the guest-only page content)
  return props.children;
};
