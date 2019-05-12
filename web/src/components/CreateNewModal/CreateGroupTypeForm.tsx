import React, { ChangeEvent } from "react";
import { dictionary, LanguageContext } from "../../utils/language";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import styles from "./CreateNewModal.module.css";

type Props = {
  id: string;
  context: any;
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
          {dictionary.post_cap[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.post_description[props.context]}
        </div>
        <br />
        <Radio value={"conference"} id={`${props.id}_type_channel`}>
          {dictionary.conference_cap[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.conference_description[props.context]}
        </div>
      </RadioGroup>
    </div>
  );
}

export default CreateGroupTypeForm;
