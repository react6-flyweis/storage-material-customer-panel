import Modal from "@/components/common_components/Modal";
import SuccessModal from "@/components/common_components/SuccessModal";
import { useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount?: string;
}

const PaymentPinModal = ({ isOpen, onClose, amount = "$40,000" }: Props) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updated = [...pin];
    updated[index] = digit;

    setPin(updated);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isPinValid = pin.join("").length === 4;

  const handleVerify = () => {
    if (!isPinValid) return;

    console.log("PIN:", pin.join(""));
    setModalTitle("Payment Completed Successfully");
    onClose()
    setIsSuccessModalOpen(true);

    // onClose();
  };

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      width="max-w-[879px]"
      customPadding="p-0"
    >
      <div className="rounded-lg bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#101828]">Total</h2>

            <p className="mt-2 text-[14px] text-[#ACACAC]">
              Including $2.24 in taxes
            </p>
          </div>

          <h1 className="text-[36px] font-medium text-[#0A0D13]">{amount}</h1>
        </div>

        <div className="mt-24 text-center">
          <h3 className="text-[18px] text-[#101828]">
            Enter your 4-digit card pin to confirm this payment
          </h3>

          <div className="mt-12 flex justify-center gap-6">
            {pin.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="h-[52px] w-[52px] rounded-lg border border-[#ACACAC] text-center text-[20px] font-semibold outline-none focus:border-[#2563EB]"
              />
            ))}
          </div>

          <p className="mx-auto mt-20 max-w-[550px] text-left text-[14px] text-[#98A2B3]">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>

          <button
            onClick={handleVerify}
            disabled={!isPinValid}
            className="mt-16 h-[56px] w-full max-w-[500px] rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-[16px] font-semibold text-white disabled:opacity-50"
          >
            Verify Pin
          </button>
         
        </div>
      </div>
    </Modal>
     <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            subSubTitle="Status will update in 24 hours"
            title={modalTitle}
          />
    </>
  );
};

export default PaymentPinModal;
