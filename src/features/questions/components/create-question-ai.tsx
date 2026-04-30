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

import {useGenerateAdaptiveQuestion} from "../hooks/use-questions";

interface CreateQuestionAIProps {
  topicId: string;
  setJobId: (jobId: string) => void;
}

const createAIQuestionsSchema = z.object({
  numberOfQuestions: z.enum([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ]),
});

type CreateAIQuestionsFormType = z.infer<typeof createAIQuestionsSchema>;

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const CreateQuestionAI = ({topicId, setJobId}: CreateQuestionAIProps) => {
  const form = useForm<CreateAIQuestionsFormType>({
    resolver: zodResolver(createAIQuestionsSchema),
    defaultValues: {
      numberOfQuestions: "1",
    },
  });

  const generateAIQuestions = useGenerateAdaptiveQuestion();

  const onSubmit = async (values: CreateAIQuestionsFormType) => {
    generateAIQuestions.mutate(
      {
        topicId,
        numberOfQuestions: parseInt(values.numberOfQuestions),
      },
      {
        onSuccess: (data) => {
          form.reset();

          setJobId(data.jobId);
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="numberOfQuestions"
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel className="text-base font-semibold">
                Number of Questions
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
                  {numbers.map((number) => (
                    <SelectItem key={number} value={number}>
                      {number}
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
          disabled={generateAIQuestions.isPending}
          className="w-full"
        >
          <LoadingSwap isLoading={generateAIQuestions.isPending}>
            Generate AI Questions
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default CreateQuestionAI;
