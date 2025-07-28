"use client";

import React, { FormEvent, useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useApiKey } from "@/app/store/useApiKey";

interface ApiKeyFormProps {
  onSuccess: () => void;
}

/**
 * Concise API Key form for Locally Loop's core functionality.
 * - Simple, direct copy.
 * - Autofocus, inline validation.
 * - Increased typography for better readability.
 * - Neutral, functional title.
 */
const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSuccess }) => {
  const { apiKey, setApiKey } = useApiKey();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(apiKey ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError("Please enter your OpenAI API key.");
      return;
    }
    setApiKey(inputValue.trim());
    toast.success("Locally Loop is ready! Get into your flow.");
    onSuccess();
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header and Description: Short and direct, with larger typography */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-loose text-gray-900 dark:text-gray-50 mb-3">
          Let’s Connect Your ChatGPT Key
          {/* This is the most direct and neutral option */}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Locally Loop requires an OpenAI API key to function.
          <br />
          Paste your key below. You can get one from the{" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-product dark:text-product hover:underline"
          >
            OpenAI Platform
          </a>
          .
        </p>
      </div>

      {/* API Key Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            id="apiKey"
            ref={inputRef}
            label="Your OpenAI API Key"
            type="password"
            placeholder="sk-..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            error={error ?? undefined}
            className="w-full text-lg"
          />
        </div>

        <Button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full px-8 py-4 text-xl"
        >
          Save Key
        </Button>
      </form>
    </div>
  );
};

export default ApiKeyForm;