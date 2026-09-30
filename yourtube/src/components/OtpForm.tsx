// src/components/OtpForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface OtpFormProps {
  challengeId: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading: boolean;
  error: string | null;
}

const OtpForm: React.FC<OtpFormProps> = ({ challengeId, onVerify, onResend, isLoading, error }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Enter OTP</h2>
        <p>An OTP has been sent to your registered device.</p>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="otp">6-Digit OTP</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="123456"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between items-center mt-4">
            <Button type="submit" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button type="button" variant="link" onClick={onResend} disabled={isLoading}>
                Resend OTP
            </Button>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;