"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import LoadingSwap from "@/components/loading-swap";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

import {useCreateQuestionManual} from "../hooks/use-questions";

interface CreateQuestionDialogProps {
  topicId: string;
  setOpen: (open: boolean) => void;
}

const createQuestionsSchema = z.object({
  question: z.string().min(10).max(300),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

type CreateQuestionsFormType = z.infer<typeof createQuestionsSchema>;

const difficulties = ["EASY", "MEDIUM", "HARD"];

const CreateManualQuestion = ({
  topicId,
  setOpen,
}: CreateQuestionDialogProps) => {
  const form = useForm<CreateQuestionsFormType>({
    resolver: zodResolver(createQuestionsSchema),
    defaultValues: {
      question: "",
      difficulty: "EASY",
    },
  });

  const createQuestion = useCreateQuestionManual();

  const onSubmit = async (values: CreateQuestionsFormType) => {
    createQuestion.mutate(
      {
        topicId,
        question: values.question.toLowerCase(),
        difficulty: values.difficulty,
      },
      {
        onSuccess: () => {
          form.reset();

          setOpen(false);
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="question"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel className="font-medium text-muted-foreground mb-1 block">
                Question
              </FieldLabel>
              <Input
                placeholder="Enter your question"
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && (
                <div className="mt-1">
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="difficulty"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel className="text-base font-semibold">
                Question Difficulty
              </FieldLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                aria-invalid={fieldState.invalid}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <div className="mt-1">
                  <FieldError errors={[fieldState.error]} />
                </div>
              )}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={createQuestion.isPending}
          className="w-full"
        >
          <LoadingSwap isLoading={createQuestion.isPending}>
            Create Question
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default CreateManualQuestion;
