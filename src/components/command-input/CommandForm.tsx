import React from "react";
import { CommandTextarea } from "./CommandInput";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

const CommandForm = () => {
  return (
    <div className="flex relative w-full max-w-2xl">
      <CommandTextarea
        autoCorrect="off"
        placeholder="Animate the cats in GSAP"
      />
      <Button className="absolute right-2 top-2 pb-3 text-xl bg-product"><Send className=""/></Button>
    </div>
  );
};

export default CommandForm;
