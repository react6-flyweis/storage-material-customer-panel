import { CreditCard, Check } from "lucide-react";
import Modal from "@/components/common_components/Modal";
import { useState } from "react";
import PaymentPinModal from "./PaymentPinModal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [cardNumber, setCardNumber] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    const limitedValue = value.slice(0, 16);

    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    setCardNumber(formattedValue);
  };

  const isCardValid = cardNumber.replace(/\s/g, "").length === 16;
  const [cardOwner, setCardOwner] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleNext = () => {
    const cardDigits = cardNumber.replace(/\s/g, "");

    if (cardDigits.length !== 16) {
      return;
    }

    if (!cardOwner.trim()) {
      return;
    }

    if (month.length !== 2 || Number(month) < 1 || Number(month) > 12) {
      return;
    }

    if (year.length !== 2) {
      return;
    }

    if (cvv.length !== 3) {
      return;
    }
onClose()
    setIsPinModalOpen(true);
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
      <div className="rounded-lg bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-semibold text-[#101828]">Total</h2>

            <p className="mt-2 text-[16px] text-[#98A2B3]">
              Including $2.24 in taxes
            </p>
          </div>

          <h1 className="text-[32px] font-medium text-[#101828]">$40,000</h1>
        </div>

        <div className="mt-8 rounded-lg border border-[#C8D5CF] bg-[#EDF7F1] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]">
                <Check size={20} className="text-white" />
              </div>

              <h3 className="text-[24px] font-semibold text-[#101828]">
                Add new card
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt=""
                className="h-10"
              />

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt=""
                className="h-8"
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-[280px_1fr] gap-x-5 items-center gap-y-8">
            <div>
              <h4 className="text-[16px] font-medium text-[#101828]">
                Card number
              </h4>

              <p className="mt-1 text-[12px] text-[#667085]">
                Enter the 16-digit card number on the card
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-[64px] flex-1 items-center gap-4 rounded-lg border border-[#D0D5DD] bg-white px-5">
                <CreditCard size={22} className="text-[#101828]" />

                <input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0987 6543 3214 3456"
                  maxLength={19}
                  className="w-full bg-transparent text-[18px] outline-none"
                />
              </div>

              <div
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border transition-all ${
                  isCardValid
                    ? "border-[#22C55E] bg-[#22C55E]"
                    : "border-[#D0D5DD] bg-white"
                }`}
              >
                <Check
                  size={24}
                  className={isCardValid ? "text-white" : "text-[#D0D5DD]"}
                />
              </div>
            </div>

            <div>
              <h4 className="text-[16px] font-medium text-[#101828]">
                Card owner
              </h4>

              <p className="mt-1 text-[12px] text-[#667085]">
                Enter the name on the card
              </p>
            </div>

            <input
              value={cardOwner}
              onChange={(e) => setCardOwner(e.target.value)}
              placeholder="John Doe"
              className="h-[64px] rounded-lg border border-[#D0D5DD] bg-white px-5 text-[18px] outline-none"
            />

            <div>
              <h4 className="text-[16px] font-medium text-[#101828]">
                Expiry date
              </h4>

              <p className="mt-1 text-[12px] text-[#667085]">
                Enter the expiration date of the card
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <input
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="07"
                  className="h-[64px] w-[70px] rounded-lg border border-[#D0D5DD] bg-white text-center text-[18px] outline-none"
                />

                <span className="text-[40px] font-light">/</span>

                <input
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="26"
                  className="h-[64px] w-[70px] rounded-lg border border-[#D0D5DD] bg-white text-center text-[18px] outline-none"
                />
              </div>

              <div>
                <h4 className="text-[16px] font-medium text-[#101828]">CVV2</h4>

                <p className="text-[12px] text-[#667085]">Security code</p>
              </div>

              <input
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                placeholder="012"
                className="h-[64px] w-[70px] rounded-lg border border-[#D0D5DD] bg-white text-center text-[18px] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <label className="flex cursor-pointer items-center gap-4">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#22C55E] text-white"
              defaultChecked
            />

            <span className="text-[16px] font-medium text-[#22C55E]">
              Set us default
            </span>
          </label>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext}
            className="h-[52px] max-w-[500px] w-full rounded-lg bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] text-[16px] font-semibold text-white"
          >
            Next
          </button>
        </div>
      </div>
     
    </Modal>
     <PaymentPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />
    </>
  );
};

export default PaymentModal;
