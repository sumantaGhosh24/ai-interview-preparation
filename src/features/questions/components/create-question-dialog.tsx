"use client";

import { useState } from "react";
import { SparkleIcon, UserIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CreateManualQuestion from "./create-question-manual";
import CreateQuestionAI from "./create-question-ai";
import QuestionGenerationStatus from "./question-generation-status";

interface CreateQuestionDialogProps {
  topicId: string;
}

const CreateQuestionDialog = ({ topicId }: CreateQuestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Questions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {jobId && <QuestionGenerationStatus jobId={jobId} topicId={topicId} />}
        <Tabs defaultValue="manual">
          <TabsList>
            <TabsTrigger value="manual">
              <UserIcon />
              Manual Question
            </TabsTrigger>
            <TabsTrigger value="automatic">
              <SparkleIcon />
              AI Questions Generator
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <CreateManualQuestion topicId={topicId} setOpen={setOpen} />
          </TabsContent>
          <TabsContent value="automatic">
            <CreateQuestionAI topicId={topicId} setJobId={setJobId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionDialog;
