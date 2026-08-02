import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await authService.verifyEmail(token);
        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message || "Email verified successfully!");
          setTimeout(() => navigate("/login"), 2500);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "Verification failed. The link may have expired."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-md text-center w-[90%] max-w-md border border-border">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Verifying your email...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">✅</span>
            <h2 className="text-xl font-semibold text-foreground">{message}</h2>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">❌</span>
            <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;