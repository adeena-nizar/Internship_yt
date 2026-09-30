"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosinstance";
import getDeviceId from "@/lib/deviceId";
import OtpForm from "@/components/OtpForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { login } = context;
  const router = useRouter();

  const handleGoogleSignIn = useGoogleAuth({
    setError,
    setIsLoading,
    setChallengeId,
    setOtpRequired,
    login,
    router,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const deviceId = getDeviceId();
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
        deviceId,
      });

      if (response.status === 202 && response.data.otp_required) {
        setChallengeId(response.data.challengeId);
        setOtpRequired(true);
      } else if (response.status === 200) {
        login(response.data.token, response.data.user);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!challengeId) {
      setError("Something went wrong. Please try logging in again.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/user/verify-otp", {
        challengeId,
        otp,
      });

      if (response.status === 200) {
        login(response.data.token, response.data.user);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!challengeId) {
        setError("Something went wrong. Please try logging in again.");
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
        const response = await axiosInstance.post("/user/resend-otp", { challengeId });
        if (response.status === 200 && response.data.challengeId) {
            setChallengeId(response.data.challengeId);
            // Optionally, provide feedback to the user that a new OTP has been sent.
        }
    } catch (err: any) {
        setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        {otpRequired && challengeId ? (
          <OtpForm
            challengeId={challengeId}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="m@example.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white dark:bg-gray-900 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;