import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import aptitudeService from "@/api/services/aptitude.service";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Question } from "@/types/Question";
import { Aptitude } from "@/types/Aptitude";
import { TRADES } from "@/constants";
import { ApiResponse } from "@/types/Api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/shadcn/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const AppearAptitude = () => {
  const [regNo, setRegNo] = useState("");
  const [trade, setTrade] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aptitude, setAptitude] = useState<Aptitude | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const [cheatingAttempts, setCheatingAttempts] = useState<number>(0);

  interface Answer {
    question_id: number;
    selected_option: number;
  }

  const [answers, setAnswers] = useState<Answer[]>([]);

  const questionsPerPage = 10;
  const params = useParams();
  const aptiId = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          setLocationError(err.message);
          setCoordinates(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
    }
  }, []);

  useEffect(() => {
    const savedAnswers = sessionStorage.getItem(
      `aptitude-answers-${aptitude?.id}`
    );
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    document.addEventListener("copy", (e: Event) => {
      e.preventDefault();
      navigator.clipboard.writeText(
        "Cheating is not a good idea. Your quiz might be cancelled"
      );
    });
  }, [aptitude?.id]);

  useEffect(() => {
    if (aptitude?.duration) {
      const durationMs = aptitude.duration * 60 * 1000;
      const startTime = +aptitude.test_timestamp * 1000;
      const elapsedTime = Date.now() - startTime;
      const timeLeft = durationMs - elapsedTime;
      setTimeLeft(timeLeft);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0) {
            clearInterval(timer);
            handleSubmitQuestions();
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [aptitude?.duration, aptitude?.id]);

  useEffect(() => {
    if (questions.length > 0) {
      const savedAnswers = sessionStorage.getItem(
        `aptitude-answers-${aptitude?.id}`
      );

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      } else {
        const initialAnswers: Answer[] = questions.map((question) => ({
          question_id: Number(question.id),
          selected_option: 0,
        }));
        setAnswers(initialAnswers);

        if (aptitude?.id) {
          sessionStorage.setItem(
            `aptitude-answers-${aptitude.id}`,
            JSON.stringify(initialAnswers)
          );
        }
      }
    }
  }, [questions, aptitude?.id]);

  useEffect(() => {
    if (questions.length <= 0) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setCheatingAttempts((prev) => prev + 1);
      } else {
        if (cheatingAttempts > 3) {
          toast({
            title: "Warning",
            description:
              "You have been caught cheating. Your quiz has been cancelled.",
            variant: "destructive",
          });
          setTimeout(() => {
            handleSubmitQuestions();
          }, 3000);
        } else {
          toast({
            title: "Cheating Warning",
            description:
              "You have been caught cheating. Further attempts will result in quiz cancellation.",
            variant: "destructive",
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [questions, cheatingAttempts]);

  const handleAnswerChange = (questionId: number, selectedOption: number) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(
      (a) => a.question_id === questionId
    );

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].selected_option = selectedOption + 1;
    } else {
      newAnswers.push({
        question_id: questionId,
        selected_option: selectedOption + 1,
      });
    }

    setAnswers(newAnswers);

    if (aptitude?.id) {
      sessionStorage.setItem(
        `aptitude-answers-${aptitude.id}`,
        JSON.stringify(newAnswers)
      );
    }
  };

  const handleGetQuiz = async () => {
    if (!coordinates) {
      toast({
        title: "Error",
        description: "Please allow location access to proceed",
        variant: "destructive",
      });
      return;
    }

    if (localStorage.getItem(`aptitude-${aptiId}-submitted`)) {
      toast({
        title: "Error",
        description: "You have already submitted your quiz",
        variant: "destructive",
      });
      return;
    }
    if (!regNo || !trade) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      let response: ApiResponse = await aptitudeService.getAptitudeForUser(
        {
          trade,
          regno: regNo,
          lat: coordinates.latitude,
          long: coordinates.longitude,
        },
        aptiId
      );
      if (typeof response.data === "string")
        response.data = JSON.parse(response.data);
      const sortedQuestions = [
        ...response.data.questions.filter(
          (q: Question) => q.question_type === "GENERAL"
        ),
        ...response.data.questions.filter(
          (q: Question) => q.question_type !== "GENERAL"
        ),
      ];
      setQuestions(sortedQuestions);
      setAptitude(response.data.aptitude);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  };

  const isLastPage =
    currentPage === Math.ceil(questions.length / questionsPerPage) - 1;

  const handleSubmitQuestions = async () => {
    setLoading(true);
    try {
      await aptitudeService.submitAptitude(
        { regno: regNo, trade },
        Number(aptitude?.id),
        answers
      );
      toast({
        title: "Success",
        description: "Questions submitted successfully",
      });
      if (aptitude?.id) {
        localStorage.setItem(`aptitude-${aptitude.id}-submitted`, "true");
        localStorage.removeItem(`aptitude-${aptitude.id - 1}-submitted`);
        sessionStorage.removeItem(`aptitude-answers-${aptitude.id}`);
        sessionStorage.removeItem(`aptitude-start-${aptitude.id}`);
      }
      navigate("/aptitudes");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (questions.length > 0) {
    return (
      <div className="container mx-auto p-4 max-w-md relative">
        <div className="fixed top-16 right-2 lg:right-4 bg-[#cc4a4a] backdrop-blur-sm text-white text-xs lg:text-sm px-2 py-1 rounded-md shadow">
          Time: {formatTime(timeLeft)}
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{aptitude?.name}</h1>
          <p className="text-sm text-gray-600">
            Duration: {aptitude?.duration} minutes | Page {currentPage + 1} of{" "}
            {Math.ceil(questions.length / questionsPerPage)}
          </p>
        </div>

        <div className="space-y-6">
          {getCurrentQuestions().map((question, idx) => (
            <div key={question.id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium mb-3">
                {currentPage * questionsPerPage + idx + 1}.{" "}
                {question.format === "img" ? (
                  <img
                    src={question.description}
                    alt="Question"
                    className="max-w-full h-auto my-2"
                  />
                ) : (
                  question.description
                )}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optIdx) => {
                  const savedAnswer = answers.find(
                    (a) => a.question_id === question.id
                  );
                  return (
                    <label
                      key={optIdx}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="radio"
                        name={`q${question.id}`}
                        className="w-4 h-4"
                        checked={savedAnswer?.selected_option === optIdx + 1}
                        onChange={() =>
                          handleAnswerChange(Number(question.id), optIdx)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          {isLastPage ? (
            <Button disabled={loading} onClick={handleSubmitQuestions}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage >=
                Math.ceil(questions.length / questionsPerPage) - 1
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      {!coordinates && !locationError && (
        <p className="text-sm text-gray-600 text-center mb-4">
          <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
          Getting location...
        </p>
      )}

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Aptitude Test</h1>

        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Registration Number
          </label>
          <Input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            placeholder="Enter your registration number"
            disabled={!coordinates}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Trade</label>
          <Select onValueChange={setTrade} disabled={!coordinates}>
            <SelectTrigger>
              <SelectValue placeholder="Select your trade" />
            </SelectTrigger>
            <SelectContent>
              {TRADES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          disabled={loading || !coordinates}
          onClick={handleGetQuiz}
          className="w-full"
        >
          {loading ? "Getting Quiz..." : "Get Quiz"}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Note: Location access is required to ensure test integrity. Please
          allow location access when prompted by your browser.
        </p>
      </div>
    </div>
  );
};

export default AppearAptitude;
