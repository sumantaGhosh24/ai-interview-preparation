"use client";

import dynamic from "next/dynamic";
import {useState} from "react";
import {useTheme} from "next-themes";

import {useSuspenseQuestion} from "@/features/questions/hooks/use-questions";
import LoadingSwap from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {useSubmitAnswer} from "../hooks/use-answers";

interface AnswerEditorProps {
  questionId: string;
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const languageOptions = [
  {label: "Plain Text", value: "plaintext"},
  {label: "JavaScript", value: "javascript"},
  {label: "TypeScript", value: "typescript"},
] as const;

type LanguageOption = (typeof languageOptions)[number]["value"];

const AnswerEditor = ({questionId}: AnswerEditorProps) => {
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState<LanguageOption>("plaintext");

  const {theme} = useTheme();

  const {data: question} = useSuspenseQuestion(questionId);

  const submitAnswer = useSubmitAnswer();

  const handleSubmit = async () => {
    const normalizedContent = content.trim();

    if (normalizedContent.length < 10) return;

    submitAnswer.mutate(
      {
        questionId,
        content: normalizedContent,
      },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Answer Question</h1>
          <p className="mt-2 text-muted-foreground">{question.question}</p>
        </div>
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as LanguageOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose editor mode" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <MonacoEditor
          height={280}
          value={content}
          language={language}
          onChange={(value) => setContent(value ?? "")}
          options={{
            minimap: {enabled: false},
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
          }}
          theme={theme === "dark" ? "vs-dark" : "light"}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Minimum 10 characters required to submit.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={submitAnswer.isPending || content.trim().length < 10}
        >
          <LoadingSwap isLoading={submitAnswer.isPending}>
            Submit Answer
          </LoadingSwap>
        </Button>
      </div>
    </div>
  );
};

export default AnswerEditor;
