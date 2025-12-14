import { SendIcon, User2Icon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import MessageBubble from "../components/message-bubble";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/survey";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { SURVEY_ABI } from "../constant";
import { supabase } from "~/postgres/supaclient";
import type { Database } from "database.types";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  await supabase.rpc("increment_survey_view", {
    survey_id: params.surveyId,
  });

  const { data: messages } = await supabase
    .from("message")
    .select("*")
    .eq("survey_id", params.surveyId);

  const { data: survey } = await supabase
    .from("survey")
    .select("finish")
    .eq("id", params.surveyId)
    .single();
  return {
    messages: messages || [],
    finish: survey?.finish || false,
  };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");
  const sender = formData.get("sender");
  await supabase.from("message").insert({
    sender: sender as string,
    message: message as string,
    survey_id: params.surveyId,
  });
};

interface Questions {
  question: string;
  options: string[];
}

const questions: Questions[] = [
  {
    question: "?��?�� ?���?? 기분??? ?��?��?��?��?",
    options: ["좋았?��?��", "보통?��?��?��", "별로????��?��"],
  },
  {
    question:
      "?��?�� �???�� 집중?�� ?�� ?��?��?�� ?��간�???�� ?��?��?���???��?",
    options: ["?���??", "?��?��", "????��", "?��?��?��?��"],
  },
  {
    question: "?��?��?�� ?��?��?��?�� ?���???�� ?���???��?���???",
    options: ["?��??? ?��?��", "?��?��", "보통", "?��?��"],
  },
  {
    question: "?��?�� ?��?��?�� ?��?��?��?��?",
    options: ["?��", "?��?��?��"],
  },
  {
    question: "?��?�� ?��마나 ?��?��?�� 취했?��?��?",
    options: ["충분?��", "보통", "�??족하�??"],
  },
  {
    question: "?��?�� �?? ?��간을 공�??/?��?�� ?��?��?��?��?��?",
    options: ["1?���?? ?��?��", "1~3?���??", "3~5?���??", "5?���?? ?��?��"],
  },
  {
    question: "?��?�� ?��로운 것을 배운 것이 ?��?��?��?",
    options: ["?��", "?��?��?��"],
  },
  {
    question: "?��?�� ?��?��?��과의 �??계는 ?��?��?��?��?",
    options: ["매우 좋았?��?��", "좋았?��?��", "보통", "?��빴어?��"],
  },
  {
    question: "?��?�� ?��?��?�� ?�� 챙겨 먹었?��?��?",
    options: [
      "?��?�� 모두 먹음",
      "?�� ?���?? 먹음",
      "?�� ?���?? 먹음",
      "�?? 먹음",
    ],
  },
  {
    question: "?��?�� ?��루�?? ?�� ?��?���?? ?��?��?��?���???",
    options: ["?���??", "?��?��", "�??�??", "?��?��", "바쁨"],
  },
];

export default function Survey({ params, loaderData }: Route.ComponentProps) {
  const { data: questions } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "getQuestions",
    args: [],
  });
  const { data: title } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "title",
    args: [],
  });
  const { data: description } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "description",
    args: [],
  });
  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  const submitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      alert("Please connect wallet before submiting answer");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const answers: number[] = [];
    for (const value of formData.values()) {
      answers.push(Number(value));
    }
    writeContract({
      address: params.surveyId as `0x{string}`,
      abi: SURVEY_ABI,
      functionName: "submitAnswer",
      args: [{ respondent: address, answers }],
    });

    await supabase.from("answer").insert({
      survey_id: params.surveyId as `0x{string}`,
      answers: answers,
    });

    const { count } = await supabase
      .from("answer")
      .select("*", { count: "exact", head: true })
      .eq("survey_id", params.surveyId);

    if (target && count !== null && count >= Number(target)) {
      await supabase
        .from("survey")
        .update({ finish: true })
        .eq("id", params.surveyId);
    }
  };

  const { data: answers } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "getAnswers",
    args: [],
  });
  const { data: target } = useReadContract({
    address: params.surveyId as `0x{string}`,
    abi: SURVEY_ABI,
    functionName: "targetNumber",
    args: [],
  });
  const [counts, setCounts] = useState<Number[][]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [messages, setMessages] = useState(loaderData?.messages || []);
  const [isFinished, setIsFinished] = useState(loaderData?.finish || false);
  const countAnswers = () => {
    // 0:[0,0,0] --> [1,0,0]
    // 1:[0,0,1]
    if (!target) return;
    return questions?.map((q, i) => {
      const count = Array.from({ length: q.options.length }).fill(
        0
      ) as number[];
      answers?.map((answer) => count[answer.answers[i]]++);
      // return count;
      return count.map((n) => (n / Number(target)) * 100);
    });
  };

  useEffect(() => {
    if (!answers || !questions || !address) {
      return;
    }
    for (const answer of answers) {
      if (answer.respondent === address) {
        setCounts(countAnswers() || []);
        setIsAnswered(true);
        return;
      }
    }
  }, [answers, address, target]);

  // isFinished일 때도 counts 계산
  useEffect(() => {
    if (isFinished && answers && questions && target) {
      const calculatedCounts = countAnswers();
      if (calculatedCounts) {
        setCounts(calculatedCounts);
        setIsAnswered(true);
      }
    }
  }, [isFinished, answers, questions, target]);

  useEffect(() => {
    const channels = supabase
      .channel("message_insert_event")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `survey_id=eq.${params.surveyId}`,
        },
        (payload) => {
          setMessages((existing) => [
            ...existing,
            payload.new as Database["public"]["Tables"]["message"]["Row"],
          ]);
        }
      )
      .subscribe();
  }, []);

  const displayTitle = isFinished && title ? `${title} (종료됨)` : title;

  return (
    <div className="grid grid-cols-3 w-screen gap-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="font-extrabold text-3xl">
            {displayTitle}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {isAnswered || isFinished ? (
          <CardContent className="overflow-y-auto h-[70vh]">
            <h1 className="font-semibold text-xl pb-2">Survey Progress</h1>
            <div className="gap-5 grid grid-cols-2">
              {questions?.map((q, i) => (
                <div className="flex flex-col">
                  <h1 className="font-bold">{q.question}</h1>
                  <div className="flex flex-col pl-2 gap-1">
                    {q.options.map((o, j) => (
                      <div className="flex flex-row justify-center items-center relative">
                        <div className="left-2 absolute text-xs font-semibold">
                          {o}
                        </div>
                        <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400 h-5 rounded-full"
                            style={{ width: `${counts[i]?.[j] || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form onSubmit={submitAnswer} className="grid grid-cols-2">
              {questions?.map((q, i) => (
                <div className="flex flex-col">
                  <span className="mt-5 mb-1">{q.question}</span>
                  {q.options.map((o, j) => (
                    <label className="flex items-center gap-1">
                      <Input
                        type="radio"
                        name={i.toString()}
                        value={j.toString()}
                        className="hidden peer"
                      ></Input>
                      <span className="w-4 h-4 rounded-full border-2 peer-checked:bg-primary"></span>
                      <span className="font-semibold">{o}</span>
                    </label>
                  ))}
                </div>
              ))}
              <Button type="submit" className="w-full mt-5">
                Submit
              </Button>
            </Form>
          </CardContent>
        )}
      </Card>
      <Card className="col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 overflow-y-auto h-[70vh]">
          {messages &&
            messages.map((m, i) => (
              <MessageBubble
                isSender={m.sender === address}
                sender={m.sender}
                message={m.message}
                created_at={m.created_at!}
              />
            ))}
        </CardContent>
        <CardFooter className="w-full">
          <Form
            method="post"
            className="flex flex-row items-center relative w-full"
          >
            <input
              type="text"
              placeholder="type a message..."
              className="border-1 w-full h-8 rounded-2xl px-2 text-xs"
              name="message"
            />
            <input
              type="text"
              className="hidden"
              name="sender"
              value={address}
            />
            <Button
              type="submit"
              className="flex flex-row justify-center items-center w-6 h-6 absolute right-2"
            >
              <SendIcon />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
