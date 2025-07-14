import { useState, useCallback } from "react";

function useHandleSubmit(
  initialText: string,
  onSubmit: (value: string) => void
) {
  const [text, setText] = useState(initialText);

  const handleSubmit = useCallback(
    (payload?: string) => {
      const value = (payload ?? text).trim();
      if (!value) return;
      onSubmit(value);
      setText("");
    },
    [text, onSubmit]
  );

  return { text, setText, handleSubmit };
}

export default useHandleSubmit;
