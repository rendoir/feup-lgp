import React, { ChangeEvent } from "react";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import styles from "./CreateNewModal.module.css";

type Props = {
  id: string;
  maxGroupSize: number;
  type: "question" | "options" | "post" | "comment";
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

function CreateGroupTypeForm(props: Props) {
  return (
    <div className={styles.type}>
      <RadioGroup name={"type"} onChange={props.onChange} value={props.type}>
        <Radio
          value={"question"}
          htmlAutoFocus={true}
          id={`${props.id}_type_quest`}
        >
          "Simple Question" Challenge
        </Radio>
        <div className={styles.typeHint}>
          "Simple Question" Challenges serve to invite conference participants
          to answer a question to win something.
        </div>
        <br />
        <Radio value={"options"} id={`${props.id}_type_opt`}>
          "Multiple Choice Question" Challenge
        </Radio>
        <div className={styles.typeHint}>
          "Multiple Choice Question" Challenges serve to invite conference
          participants to answer a question with multiple choice options, to win
          something.
        </div>
        <br />
        <Radio value={"post"} id={`${props.id}_type_mult`}>
          "Create a Post" Challenge
        </Radio>
        <div className={styles.typeHint}>
          "Create a Post" Challenges serve to invite conference participants to
          write posts on conference.
        </div>
        <br />
        <Radio value={"comment"} id={`${props.id}_type_post`}>
          "Comment on a Post" Challenge
        </Radio>
        <div className={styles.typeHint}>
          "Comment on a Post" Challenges serve to invite conference participants
          to write comments on specific posts on conference.
        </div>
        <br />
      </RadioGroup>
    </div>
  );
}

export default CreateGroupTypeForm;
