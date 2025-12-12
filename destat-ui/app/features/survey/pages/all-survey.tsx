import { useReadContract } from "wagmi";
import SurveyCard from "../components/survey-card";
import { SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";

interface SurveyMeta {
  title: string;
  description: string;
  count: number;
  view: number | null;
  image: string | null;
  address: string;
}

export default function AllSurveys() {
  // const { data } = useReadContract({
  //   address: SURVEY_FACTORY,
  //   abi: SURVEY_FACTORY_ABI,
  //   functionName: "getSurveys",
  //   args: [],
  // });
  const [surveys, setSurveys] = useState<SurveyMeta[]>([]);
  const onChainLoader = async () => {
    const client = createPublicClient({
      chain: hardhat,
      transport: http(),
    });
    const surveyFactoryContract = getContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      client,
    });
    const surveys = await surveyFactoryContract.read.getSurveys();
    const surveyMetadata = await Promise.all(
      surveys.map(async (surveyAddress) => {
        const surveyContract = getContract({
          address: surveyAddress,
          abi: SURVEY_ABI,
          client,
        });
        const title = await surveyContract.read.title();
        const description = await surveyContract.read.description();
        const answers = await surveyContract.read.getAnswers();
        return {
          title,
          description,
          count: answers.length,
          view: null,
          image: null,
          address: surveyAddress,
        };
      })
    );
    return surveyMetadata;
  };

  const offChainLoader = async (): Promise<SurveyMeta[]> => {
    return [
      {
        title: "New Survey",
        description: "Override test",
        count: 10,
        view: 1600,
        image: "https://avatars.githubusercontent.com/u/18018028?v=4",
        address: "",
      },
    ];
  };

  useEffect(() => {
    const onChainData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const onchainSurveys = await onChainLoader();
      setSurveys(onchainSurveys);
    };
    onChainData();
    const offChainData = async () => {
      const offchainSurveys = await offChainLoader();
      setSurveys(offchainSurveys);
    };
    offChainData();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold">Live Surveys</h1>
        <span className="font-light">Join the surveys!</span>
      </div>
      {surveys.map((survey) => (
        <SurveyCard
          title={survey.title}
          description={survey.description}
          view={1600}
          count={survey.count}
          image={"https://avatars.githubusercontent.com/u/18018028?v=4"}
          address={survey.address}
        />
      ))}
    </div>
  );
}
