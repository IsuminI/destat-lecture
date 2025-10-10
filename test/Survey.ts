import { expect } from "chai";
import { ethers, keccak256 } from "ethers";
import { network } from "hardhat";
import type { SurveyFactory } from "../types/ethers-contracts/SurveyFactory.sol/SurveyFactory.js";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
interface Question {
  question: string;
  options: string[];
}

// it("Survey init", async () => {
//   const { ethers } = await network.connect();

//   const title = "막무가내 설문조사";
//   const description = "1111";
//   const questions: Question[] = [
//     {
//       question: "질문1",
//       options: ["답변1", "답변2"],
//     },
//   ];

//   const factory = await ethers.deployContract("SurveyFactory", [
//     ethers.parseEther("50"),
//     ethers.parseEther("0.1"),
//   ]);
//   const tx = await factory.createSurvey(
//     {
//       title,
//       description,
//       targetNumber: 100,
//       questions,
//     },
//     {
//       value: ethers.parseEther("100"),
//     },
//   );

//   // const surveys = await factory.getSurveys();
//   const receipt = await tx.wait();
//   let surveyAddress;
//   receipt?.logs.forEach((log) => {
//     const event = factory.interface.parseLog(log);
//     if (event?.name == "SurveyCreated") {
//       surveyAddress = event.args[0];
//     }
//   });

//   //const survey = await ethers.deployContract("Survey", [title, description, ...])
//   const surveyC = await ethers.getContractFactory("Survey");
//   const signers = await ethers.getSigners();
//   const respondent = signers[0];
//   if (surveyAddress) {
//     const survey = await surveyC.attach(surveyAddress);
//     await survey.connect(respondent);
//     console.log(
//       ethers.formatEther(await ethers.provider.getBalance(respondent)),
//     );
//     const submitTx = await survey.submitAnswer({
//       respondent,
//       answers: [1],
//     });
//     await submitTx.wait();
//     console.log(
//       ethers.formatEther(await ethers.provider.getBalance(respondent)),
//     );
//   }
// });

it("Survey storage layout", async () => {
  const { ethers } = await network.connect();

  const title = "막무가내 설문조사";
  const description =
    "가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하";
  const questions: Question[] = [
    {
      question: "질문1",
      options: ["답변1", "답변2"],
    },
  ];

  const survey = await ethers.deployContract(
    "Survey",
    [title, description, 100, questions],
    {
      value: ethers.parseEther("100"),
    },
  );

  const slot0 = ethers.toBeHex(0, 32);
  const slot0Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot0,
  );
  const slot1 = ethers.toBeHex(1, 32);
  const slot1Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot1,
  );
  const slot2 = ethers.toBeHex(2, 32);
  const slot2Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot2,
  );
  const slot3 = ethers.toBeHex(3, 32);
  const slot3Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot3,
  );
  const slot4 = ethers.toBeHex(4, 32);
  const slot4Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot4,
  );
  const slot5 = ethers.toBeHex(5, 32);
  const slot5Data = await ethers.provider.getStorage(
    survey.getAddress(),
    slot5,
  );

  const decodeUni = (hex: string) =>
    Buffer.from(hex.slice(2), "hex").toString("utf-8");

  // primitive type
  console.log("primitive types");
  console.log(slot2Data);
  console.log(slot3Data);

  // long string type
  console.log("long string types");
  console.log(slot1Data);
  // pDesc = hash256(pSlot1), getStorage(pDesc)
  const pDesc = keccak256(slot1);
  const desc = await ethers.provider.getStorage(
    await survey.getAddress(),
    pDesc,
  );
  console.log(decodeUni(desc));

  console.log(decodeUni(slot0Data));
  console.log(slot0Data);

  console.log(slot4Data);
  console.log(slot5Data);
});

describe("SurveyFactory Contract", () => {
  let factory: SurveyFactory,
    owner: HardhatEthersSigner,
    respondent1,
    respondent2;

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
    expect(await factory.min_pool_amount()).eq(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).eq(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
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
    const receipt = await tx.wait();
    let surveyAddress;
    receipt?.logs.forEach((log) => {
      const event = factory.interface.parseLog(log);
      if (event?.name == "SurveyCreated") {
        surveyAddress = event.args[0];
      }
    });
    await expect(tx).emit(factory, "SurveyCreated").withArgs(surveyAddress);

    // TODO: check surveys array length increased
    expect((await factory.getSurveys()).length).eq(1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
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
    ).to.be.revertedWith("insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
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
    ).to.be.revertedWith("insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    // TODO: create multiple surveys and check getSurveys output
    const { ethers } = await network.connect();

    const factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"),
      ethers.parseEther("0.1"),
    ]);

    const surveyAddresses: string[] = [];
    for (let i = 0; i < 10; i++) {
      const title = "설문조사 " + i;
      const description = "설명 " + i;
      const questions: Question[] = [
        {
          question: "질문",
          options: ["답변1", "답변2"],
        },
      ];

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
      const receipt = await tx.wait();
      let surveyAddress;
      receipt?.logs.forEach((log) => {
        const event = factory.interface.parseLog(log);
        if (event?.name == "SurveyCreated") {
          surveyAddress = event.args[0];
          surveyAddresses.push(surveyAddress);
        }
      });
    }

    for (let i = 0; i < 10; i++) {
      const surveyC = await ethers.getContractFactory("Survey");
      const survey = await surveyC.attach(surveyAddresses[i]);
      expect(await survey.title()).equals("설문조사 " + i);
      expect(await survey.description()).equals("설명 " + i);
    }
  });
});
