import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import Select from "../Select/Select";
import Switcher from "../Switcher/Switcher";
import Tag from "../Tags/Tag";
import styles from "./CreateNewModal.module.css";

export type Props = {
  id: string;
  type: "question" | "options" | "post" | "comment";
  title: string;
  about: string;
  dateStart: string;
  dateEnd: string;
  prize: string;
  pointsPrize: string;
  post: string;
  question: string;
  correctAnswer: string;
  options: string[];
  switcher: string;
  className?: string;
  vertical: boolean;
  isPublicGroupEnabled: boolean;
  aboutMaxLength?: number;
  onSubmit: (event: Event) => void;
  onChange: (value: string, event: ChangeEvent) => void;
};

export type State = {
  prize: string;
  pointsPrize: string;
  post: string;
  question: string;
  correctAnswer: string;
  options: string[];
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static defaultProps = {
    about: "",
    aboutMaxLength: 3000,
    dateEnd: "",
    dateStart: "",
    switcher: "false",
    title: "",
    vertical: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      correctAnswer: "",
      options: [],
      pointsPrize: "",
      post: "",
      prize: "",
      question: ""
    };
  }

  public render() {
    const { id, type, about, aboutMaxLength, title, vertical } = this.props;

    console.log("type");

    const className = classNames(
      styles.info,
      {
        [styles.vertical]: vertical
      },
      this.props.className
    );

    return (
      <div className={className}>
        <form id={id} autoComplete={"off"} className={styles.form}>
          <InputNext
            className={styles.input}
            id={`${id}_title`}
            name={"title"}
            onChange={this.props.onChange}
            placeholder={`${type} title`}
            label={`Title`}
            value={title}
            htmlAutoFocus={true}
            required={true}
          />
          <InputNext
            className={styles.input}
            id={`${id}_about`}
            name={"about"}
            onChange={this.props.onChange}
            placeholder={`Write a short description of this ${type}`}
            label={`Description`}
            type={"textarea"}
            rows={5}
            value={about || ""}
            maxLength={aboutMaxLength}
            required={true}
          />
          {type === "question" ? this.renderQuestionFields() : null}
          {type === "options" ? this.renderOptionsFields() : null}
          {type === "post" ? this.renderPostFields() : null}
          {type === "comment" ? this.renderCommentFields() : null}
        </form>
      </div>
    );
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    this.props.onSubmit(event);
  };

  private handleChange = (value: string, event: ChangeEvent) => {
    // @ts-ignore
    this.setState({
      [(event.target as HTMLAbstractInputElement).name]: value
    });
    this.props.onChange(value, event);
  };

  private renderQuestionFields() {
    const { id } = this.props;

    return <div>Question</div>;
  }

  private renderOptionsFields() {
    const { id } = this.props;

    return <div>Options</div>;
  }

  private renderPostFields() {
    const { id } = this.props;

    return <div>Post</div>;
  }

  private renderCommentFields() {
    const { id } = this.props;

    return <div>Comment</div>;
  }
}

export default CreateGroupInfoForm;
