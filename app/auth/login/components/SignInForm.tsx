"use client";
import { getSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSnackbar } from "notistack";

export default function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (response?.ok) {
        enqueueSnackbar("Login successful! Redirecting...", {
          variant: "success",
          autoHideDuration: 2000,
        });

        // Get the session to check approval status
        const session = await getSession();

        setTimeout(() => {
          if (session?.user?.needsApproval) {
            router.push("/pendingApproval");
          } else if (session?.user?.isApproved && session.user?.id) {
            router.push(`/admin/${session.user.id}`);
          } else if (session?.user?.id) {
            router.push(`/admin/${session.user.id}`);
          } else {
            enqueueSnackbar(
              "Session error: Unable to retrieve user information.",
              {
                variant: "error",
              }
            );
          }
        }, 1000);
      } else if (response?.status === 401) {
        enqueueSnackbar("Invalid email or password. Please try again.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Login failed. Please try again later.", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      enqueueSnackbar("An unexpected error occurred. Please try again.", {
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="font-[sans-serif] ">
      <div className="  flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Login for Exclusive Access
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              High Secured Data inside here. Don&apos;t try to access if you
              don&apos;t have access.
            </p>
            <p className="text-sm mt-12 text-gray-800">
              Don&apos;t have an account{" "}
              <a
                href="/auth/signup"
                className="text-[#6DB6FE] font-semibold hover:underline ml-1"
              >
                Register here..
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full">
            <h3 className="text-[#15134A] text-3xl font-extrabold mb-8">
              Sign in
            </h3>

            <div className="space-y-4">
              <div>
                <input
                  name="email"
                  disabled={pending}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-[#15134A] focus:bg-transparent"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-[#15134A] focus:bg-transparent"
                  placeholder="Password"
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute top-4 right-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEye size={18} className="text-gray-500" />
                  ) : (
                    <AiOutlineEyeInvisible
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#15134A] focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="javascript:void(0);"
                    className="text-[#15134A] hover:opacity-30 font-semibold"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                disabled={pending}
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#15134A] hover:opacity-30 focus:outline-none disabled:opacity-50"
              >
                {pending ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
