// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Survey.sol";

struct SurveyScheme {
  string title;
  string description;
  uint256 targetNumber;
  Question[] questions;
}

event SurveyCreated(address);

contract SurveyFactory {
  uint256 public min_pool_amount;
  uint256 public min_reward_amount;
  Survey[] surveys;

  // ex)
  // pool amount : 50 eth
  // target respondents number : 100
  // reward : 50 eth / 100 == 0.5 eth
  constructor(uint256 _min_pool_amount, uint256 _min_rerward_amount) {
    min_pool_amount = _min_pool_amount;
    min_reward_amount = _min_rerward_amount;
  }

  function createSurvey(SurveyScheme calldata _survey) external payable {
    require(msg.value >= min_pool_amount, "insufficient pool amount");
    require(
      msg.value / _survey.targetNumber >= min_reward_amount,
      "insufficient reward amount"
    );

    Survey survey = new Survey{value: msg.value}(
      _survey.title,
      _survey.description,
      _survey.targetNumber,
      _survey.questions
    );
    surveys.push(survey);
    emit SurveyCreated(address(survey));
  }

  function getSurveys() external view returns (Survey[] memory) {
    return surveys;
  }
}
