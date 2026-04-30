"use client";

import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import LoadingSwap from "@/components/loading-swap";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

import {useCreateTopic} from "../hooks/use-topics";

const createTopicSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
});

type CreateTopicFormType = z.infer<typeof createTopicSchema>;

const CreateTopicDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTopicFormType>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTopic = useCreateTopic();

  const onSubmit = async (values: CreateTopicFormType) => {
    createTopic.mutate(
      {
        name: values.name.toLowerCase(),
        description: values.description.toLowerCase(),
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Topic</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-6">
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <FieldLabel className="font-medium text-muted-foreground mb-1 block">
                    Topic Name
                  </FieldLabel>
                  <Input
                    placeholder="Enter your topic name"
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
              name="description"
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <FieldLabel className="font-medium text-muted-foreground mb-1 block">
                    Topic Description
                  </FieldLabel>
                  <Textarea
                    placeholder="Enter your topic description"
                    rows={7}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="rounded-lg border border-input focus:border-primary/60 bg-background shadow-sm transition min-h-30 resize-y"
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
            <Button
              type="submit"
              disabled={createTopic.isPending}
              className="w-full"
            >
              <LoadingSwap isLoading={createTopic.isPending}>
                Create Topic
              </LoadingSwap>
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
