import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { QUESTION_TYPES } from "@/constants";

import questionService from "@/api/services/question.service";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddQuestionDialog: React.FC = () => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState<{
    description: string;
    topic_tags: string;
    question_type: string;
    difficulty_level: number;
    options: string[];
    correct_option: number;
    format: string;
    img: File | null;
  }>({
    description: "",
    topic_tags: "",
    question_type: "GENERAL",
    difficulty_level: 1,
    options: ["", "", "", ""],
    correct_option: 0,
    format: "text",
    img: null,
  });

  const handleAddQuestion = async () => {
    // validate
    if (
      !newQuestion.topic_tags.length ||
      !newQuestion.options.every((option) => option.trim()) ||
      newQuestion.correct_option < 0 ||
      newQuestion.correct_option >= newQuestion.options.length ||
      (newQuestion.format === "text" && !newQuestion.description) ||
      (newQuestion.format === "img" && !newQuestion.img) ||
      !newQuestion.question_type ||
      !newQuestion.difficulty_level
    ) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Create FormData to handle file upload
      const formData = new FormData();
      (Object.keys(newQuestion) as (keyof typeof newQuestion)[]).forEach(
        (key) => {
          if (key === "img" && newQuestion.img) {
            formData.append("img", newQuestion.img);
          } else {
            if (typeof newQuestion[key] === "string")
              formData.append(key, newQuestion[key].trim());
            else if (Array.isArray(newQuestion[key]))
              formData.append(key, newQuestion[key].join(",").trim());
            else formData.append(key, JSON.stringify(newQuestion[key]).trim());
          }
        }
      );

      // API call to add question
      const res = await questionService.addQuestion(formData);
      console.log(res);
      // setQuestions([...questions, res.data]);
      toast({
        title: "Success",
        description: "Question added successfully",
      });
      setIsAddingQuestion(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
        <DialogTrigger asChild>
          <Button>Add Question</Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="format" className="text-foreground">
                Question Format
              </Label>
              <Select
                value={newQuestion.format}
                onValueChange={(value) =>
                  setNewQuestion({
                    ...newQuestion,
                    format: value,
                  })
                }
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Question Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="img">img</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newQuestion.format === "text" ? (
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-foreground">
                  Question Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Question description"
                  value={newQuestion.description}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="img" className="text-foreground">
                  Question img
                </Label>
                <Input
                  id="img"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      img: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="topics" className="text-foreground">
                Related Topics
              </Label>
              <Input
                id="topics"
                placeholder="Related topics (comma-separated)"
                value={newQuestion.topic_tags}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    topic_tags: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="question-type" className="text-foreground">
                Question Type
              </Label>
              <Select
                value={newQuestion.question_type}
                onValueChange={(value) =>
                  setNewQuestion({
                    ...newQuestion,
                    question_type: value,
                  })
                }
              >
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="difficulty" className="text-foreground">
                Difficulty Level
              </Label>
              <Select
                value={String(newQuestion.difficulty_level)}
                onValueChange={(value) =>
                  setNewQuestion({
                    ...newQuestion,
                    difficulty_level: parseInt(value),
                  })
                }
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((level) => (
                    <SelectItem key={level} value={String(level)}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newQuestion.options.map((option, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={`option-${index}`} className="text-foreground">
                  Option {index + 1}
                </Label>
                <Input
                  id={`option-${index}`}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="correct-option" className="text-foreground">
                Correct Option
              </Label>
              <Select
                value={String(newQuestion.correct_option)}
                onValueChange={(value) =>
                 {
                 console.log(value);
                  setNewQuestion({
                    ...newQuestion,
                    correct_option: parseInt(value),
                  })
                }}
              >
                <SelectTrigger id="correct-option">
                  <SelectValue placeholder="Correct Option" />
                </SelectTrigger>
                <SelectContent>
                  {newQuestion.options.map((_, index) => (
                    <SelectItem key={index+1} value={String(index+1)}>
                      Option {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddQuestion} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Question"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddQuestionDialog;
