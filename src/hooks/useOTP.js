import { useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/config/firebase.config.js";
import logger from "@/utils/logger";

export function useOTP() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
    return recaptchaRef.current;
  };

  async function sendOTP(phone, { onError } = {}) {
    if (!phone || !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone)) {
      onError?.("Số điện thoại không hợp lệ");
      return;
    }
    setOtpLoading(true);
    try {
      const formatted = "+84" + phone.slice(1);
      confirmationRef.current = await signInWithPhoneNumber(
        auth,
        formatted,
        getRecaptcha(),
      );
      setOtpSent(true);
    } catch (err) {
      logger.log(err);
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      onError?.("Gửi OTP thất bại, thử lại!");
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifyOTP(otp, { onError } = {}) {
    try {
      const result = await confirmationRef.current.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      return firebaseToken;
    } catch (err) {
      logger.log(err);
      onError?.("OTP không đúng hoặc đã hết hạn!");
      return null;
    }
  }

  function resetOTP() {
    setOtpSent(false);
    confirmationRef.current = null;
    recaptchaRef.current?.clear(); // ✅ cleanup
    recaptchaRef.current = null;
  }

  return { otpSent, otpLoading, sendOTP, verifyOTP, resetOTP };
}
