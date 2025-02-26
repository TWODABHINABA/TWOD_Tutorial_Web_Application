import { useState } from "react";
import SetPassword from "./SetPassword";

const SetPasswordWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <SetPassword isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SetPasswordWrapper;