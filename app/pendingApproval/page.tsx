"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Clock,
  AlertCircle,
  LogOut,
  CheckCircle,
  Mail,
  RefreshCw,
  Copy,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function PendingApproval() {
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userRejected, setUserRejected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const checkUserStatus = async () => {
    if (!session?.user?.email || checkingStatus) return;

    setCheckingStatus(true);
    try {
      const response = await fetch("/api/user/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.exists) {
          setUserRejected(true);
          enqueueSnackbar(
            "Your account has been rejected by the administrator.",
            {
              variant: "error",
              autoHideDuration: 5000,
            }
          );
        }
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user && !userRejected) {
      enqueueSnackbar(
        `Welcome ${
          session.user.name || session.user.email
        }! Your account is pending approval.`,
        {
          variant: "info",
          autoHideDuration: 5000,
        }
      );

      // Check user status after a short delay
      setTimeout(() => {
        checkUserStatus();
      }, 1000);
    }
  }, [status, session, enqueueSnackbar]);

  useEffect(() => {
    if (session?.user?.isApproved && !session?.user?.needsApproval) {
      enqueueSnackbar("Great news! Your account has been approved!", {
        variant: "success",
        autoHideDuration: 3000,
      });

      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    }
  }, [session, enqueueSnackbar, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      enqueueSnackbar("Signing out...", {
        variant: "info",
        autoHideDuration: 2000,
      });

      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      enqueueSnackbar("Error signing out. Please try again.", {
        variant: "error",
      });
      setIsSigningOut(false);
    }
  };

  const handleCopyEmail = () => {
    if (session?.user?.email) {
      navigator.clipboard.writeText(session.user.email);
      enqueueSnackbar("Email copied to clipboard", {
        variant: "success",
        autoHideDuration: 2000,
      });
    }
  };

  const handleContactAdmin = () => {
    enqueueSnackbar(
      "Please contact your system administrator for approval status updates",
      {
        variant: "info",
        autoHideDuration: 4000,
      }
    );
  };

  const handleBackToLogin = () => {
    enqueueSnackbar("Redirecting to login page...", {
      variant: "info",
      autoHideDuration: 2000,
    });

    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    checkUserStatus();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // If user is rejected, show rejection message
  if (userRejected) {
    return (
      <div className="font-[sans-serif] bg-white">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
            <div>
              <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-red-800">
                Account Rejected
              </h2>
              <p className="text-sm mt-6 text-gray-800">
                Unfortunately, your account application has been reviewed and
                rejected by the administrator.
              </p>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Application Denied
                    </p>
                    <p className="text-sm text-red-700">
                      Your account request did not meet the security
                      requirements or approval criteria.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Need More Information?
                    </p>
                    <p className="text-sm text-blue-700">
                      Contact your system administrator for details about the
                      rejection or to request a new application.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-auto w-full">
              <div className="bg-white rounded-lg border justify-center border-gray-200 p-8 shadow-md">
                <div className="text-center mb-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-600 mb-4">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-red-600 text-3xl font-extrabold mb-2">
                    Access Denied
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your account application has been rejected
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-red-50 rounded-md p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      What this means
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Your account has been permanently removed from the
                        system
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        You will need to submit a new application to gain access
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Contact administrator for specific rejection reasons
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-md p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      Next Steps
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Contact your system administrator to understand the
                      rejection reason and discuss reapplication options.
                    </p>
                    <button
                      onClick={handleContactAdmin}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Contact Administrator
                    </button>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-red-600 hover:opacity-80 focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>

                    <button
                      onClick={handleBackToLogin}
                      className="w-full py-2.5 px-4 text-sm font-semibold rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Account Under Review
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Your account has been created successfully and is currently
              awaiting administrator approval for secure access to the system.
            </p>

            {session?.user && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Account Details
                    </p>
                    <div className="space-y-1">
                      {session.user.name && (
                        <p className="text-sm text-blue-700">
                          Name: {session.user.name}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-blue-700">
                          Email: {session.user.email}
                        </p>
                        <button
                          onClick={handleCopyEmail}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Copy email"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Approval Required
                  </p>
                  <p className="text-sm text-yellow-700">
                    High security protocols require manual verification before
                    granting access to sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-auto w-full">
            <div className="bg-white rounded-lg border justify-center border-gray-200 p-8 shadow-md">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#15134A] mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-[#15134A] text-3xl font-extrabold mb-2">
                  Pending Approval
                </h3>
                <p className="text-gray-600 text-sm">
                  Please wait while we review your account
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    What happens next?
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-[#15134A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Administrator reviews your account details and credentials
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-[#15134A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Email notification sent once your account is approved
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-[#15134A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Full system access granted after successful verification
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Need Assistance?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    For questions about your account status or approval
                    timeline, please contact your system administrator.
                  </p>
                  <button
                    onClick={handleContactAdmin}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Contact Administrator
                  </button>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing || checkingStatus}
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded text-[#15134A] bg-blue-50 hover:bg-blue-100 focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-blue-200"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isRefreshing || checkingStatus ? "animate-spin" : ""
                      }`}
                    />
                    {isRefreshing || checkingStatus
                      ? "Checking..."
                      : "Check Status"}
                  </button>

                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#15134A] hover:opacity-80 focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>

                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded text-[#15134A] bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
