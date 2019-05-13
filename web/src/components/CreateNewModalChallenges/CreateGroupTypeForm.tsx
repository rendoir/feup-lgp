import React, { ChangeEvent } from "react";
import { dictionary, LanguageContext } from "../../utils/language";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import styles from "./CreateNewModal.module.css";

type Props = {
  id: string;
  context: any;
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
          {dictionary.simple_question[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.simple_question[props.context]}{" "}
          {dictionary.simple_question_desc[props.context]}
        </div>
        <br />
        <Radio value={"options"} id={`${props.id}_type_opt`}>
          {dictionary.mult_choice_question[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.mult_choice_question[props.context]}{" "}
          {dictionary.mult_choice_question_desc[props.context]}
        </div>
        <br />
        <Radio value={"post"} id={`${props.id}_type_mult`}>
          {dictionary.post_create[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.post_create[props.context]}{" "}
          {dictionary.post_create_desc[props.context]}
        </div>
        <br />
        <Radio value={"comment"} id={`${props.id}_type_post`}>
          {dictionary.comment_post[props.context]}
        </Radio>
        <div className={styles.typeHint}>
          {dictionary.comment_post[props.context]}{" "}
          {dictionary.comment_post_desc[props.context]}
        </div>
        <br />
      </RadioGroup>
    </div>
  );
}

export default CreateGroupTypeForm;
