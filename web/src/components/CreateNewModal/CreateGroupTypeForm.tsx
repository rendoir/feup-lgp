import React, { ChangeEvent } from "react";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import styles from "./CreatNewModal.module.css";

type Props = {
  id: string;
  maxGroupSize: number;
  type: "group" | "channel";
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

function CreateGroupTypeForm(props: Props) {
  return (
    <div className={styles.type}>
      <RadioGroup name={"type"} onChange={props.onChange} value={props.type}>
        <Radio
          value={"group"}
          htmlAutoFocus={true}
          id={`${props.id}_type_group`}
        >
          <p className={styles.typeLabel}>CreateNewModal.group.type.title</p>
        </Radio>
        <div className={styles.typeHint} id={"CreateNewModal.group.type.hint"}>
          {String(props.maxGroupSize)}
        </div>
        <br />
        <Radio value={"channel"} id={`${props.id}_type_channel`}>
          <p className={styles.typeLabel}>CreateNewModal.channel.type.title</p>
        </Radio>
        <div
          className={styles.typeHint}
          id={"CreateNewModal.channel.type.hint"}
        >
          CreateNewModal.channel.type.hint
        </div>
      </RadioGroup>
    </div>
  );
}

export default CreateGroupTypeForm;
