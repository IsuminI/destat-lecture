import { expect } from "chai";
import { ethers } from "ethers";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

it("Survey init", async () => {
  const { ethers } = await network.connect();

  const title = "막무가내 설문조사";
  const description = "1111";
  const questions: Question[] = [
    {
      question: "질문1",
      options: ["답변1", "답변2"],
    },
  ];

  const factory = await ethers.deployContract("SurveyFactory", [
    ethers.parseEther("50"),
    ethers.parseEther("0.1"),
  ]);
  const tx = await factory.createSurvey(
    {
      title,
      description,
      targetNumber: 100,
      questions,
    },
    {
      value: ethers.parseEther("100"),
    },
  );

  // const surveys = await factory.getSurveys();
  const receipt = await tx.wait();
  let surveyAddress;
  receipt?.logs.forEach((log) => {
    const event = factory.interface.parseLog(log);
    if (event?.name == "SurveyCreated") {
      surveyAddress = event.args[0];
    }
  });

  //const survey = await ethers.deployContract("Survey", [title, description, ...])
  const surveyC = await ethers.getContractFactory("Survey");
  const signers = await ethers.getSigners();
  const respondent = signers[0];
  if (surveyAddress) {
    const survey = await surveyC.attach(surveyAddress);
    await survey.connect(respondent);
    console.log(
      ethers.formatEther(await ethers.provider.getBalance(respondent)),
    );
    const submitTx = await survey.submitAnswer({
      respondent,
      answers: [1],
    });
    await submitTx.wait();
    console.log(
      ethers.formatEther(await ethers.provider.getBalance(respondent)),
    );
  }
});

describe("SurveyFactory Contract", () => {
  let factory, owner, respondent1, respondent2;

  const title = "막무가내 설문조사";
  const description = "1111";
  const questions: Question[] = [
    {
      question: "질문1",
      options: ["답변1", "답변2"],
    },
  ];

  beforeEach(async () => {
    const { ethers } = await network.connect();

    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    const { ethers } = await network.connect();
    expect(await factory.min_pool_amount()).eq(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).eq(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const { ethers } = await network.connect();
    const tx = await factory.createSurvey(
      {
        title,
        description,
        targetNumber: 100,
        questions,
      },
      {
        value: ethers.parseEther("100"),
      },
    );

    // TODO: check event SurveyCreated emitted
    expect(tx).emit(await factory, "SurveyCreated");

    // TODO: check surveys array length increased
    expect((await factory.getSurveys()).length).eq(1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    const { ethers } = await network.connect();
    await expect(
      factory.createSurvey(
        {
          title,
          description,
          targetNumber: 100,
          questions,
        },
        {
          value: ethers.parseEther("1"),
        },
      ),
    ).revertedWith("insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const { ethers } = await network.connect();
    await expect(
      factory.createSurvey(
        {
          title,
          description,
          targetNumber: 5000,
          questions,
        },
        {
          value: ethers.parseEther("100"),
        },
      ),
    ).revertedWith("insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    const { ethers } = await network.connect();
    // TODO: create multiple surveys and check getSurveys output
    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"),
      ethers.parseEther("0.1"),
    ]);
    for (let i = 0; i < 10; i++) {
      const title = "설문조사 " + i;
      const description = "설명 " + i;
      const questions: Question[] = [
        {
          question: "질문",
          options: ["답변1", "답변2"],
        },
      ];

      await factory.createSurvey(
        {
          title,
          description,
          targetNumber: 100,
          questions,
        },
        {
          value: ethers.parseEther("100"),
        },
      );
    }

    const surveys = await factory.getSurveys();
    for (let i = 0; i < 10; i++) {
      const Survey = await ethers.getContractFactory("Survey");
      const survey = await Survey.attach(surveys[i]);
      expect(await survey.title()).equals("설문조사 " + i);
      expect(await survey.description()).equals("설명 " + i);
    }
  });
});
