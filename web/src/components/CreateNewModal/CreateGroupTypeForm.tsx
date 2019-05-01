import React, { ChangeEvent } from "react";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import styles from "./CreateNewModal.module.css";

type Props = {
  id: string;
  maxGroupSize: number;
  type: "post" | "conference";
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

function CreateGroupTypeForm(props: Props) {
  return (
    <div className={styles.type}>
      <RadioGroup name={"type"} onChange={props.onChange} value={props.type}>
        <Radio
          value={"post"}
          htmlAutoFocus={true}
          id={`${props.id}_type_group`}
        >
          Post
        </Radio>
        <div className={styles.typeHint}>
          Post are the basic mechanism used to share knowledge.
        </div>
        <br />
        <Radio value={"conference"} id={`${props.id}_type_channel`}>
          Conference
        </Radio>
        <div className={styles.typeHint}>
          Conferences are formal meetings for discussion of a particular topic.
        </div>
      </RadioGroup>
    </div>
  );
}

export default CreateGroupTypeForm;
