import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import OptionAnswer from "../OptionAnswer/OptionAnswer";
import RadioGroup from "../Radio/RadioGroup";
import Select from "../Select/Select";
import Switcher from "../Switcher/Switcher";
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
  optionsInput: string;
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
      optionsInput: "",
      pointsPrize: "",
      post: "",
      prize: "",
      question: ""
    };
  }

  public render() {
    const { id, type, about, aboutMaxLength, title, vertical } = this.props;

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
            placeholder="Write a short description of this Challenge."
            label={`Description`}
            type={"textarea"}
            rows={5}
            value={about || ""}
            maxLength={aboutMaxLength}
            required={true}
          />
          <div id={`${id}_challenge_dates`}>
            <label htmlFor={`${id}_challenge_dates`} className={styles.dates}>
              Dates
            </label>
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_date_start`}
              value={this.props.dateStart}
              name={"dateStart"}
              label={"Start"}
              type={"datetime-local"}
            />
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_date_end`}
              value={this.props.dateEnd}
              name={"dateEnd"}
              label={"End"}
              type={"datetime-local"}
            />
          </div>
          <div id={`${id}_challenge_prize`}>
            <label htmlFor={`${id}_challenge_prize`} className={styles.dates}>
              Prize
            </label>
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_prize_description`}
              value={this.props.prize}
              placeholder={"Write a short description of the prize given"}
              name={"prize"}
              label={"Prize"}
              type={"text"}
            />
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_prize_points`}
              value={this.props.pointsPrize}
              placeholder={"If prize is not in points, input 0"}
              name={"points"}
              label={"Prize Points"}
              type={"text"}
            />
          </div>
          <hr />
          {type === "question" ? this.renderQuestionFields() : null}
          {type === "options" ? this.renderOptionsFields() : null}
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

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const options = this.state.options;
      if (!options.includes(this.state.optionsInput)) {
        options.push(this.state.optionsInput);
      }
      this.setState({ options, optionsInput: "" });
    }
  };

  private renderQuestionFields() {
    const { id } = this.props;

    return (
      <div>
        <InputNext
          className={styles.input}
          id={`${id}_question`}
          name={"question"}
          onChange={this.props.onChange}
          placeholder="question"
          label={`Question`}
          value={this.props.question}
          htmlAutoFocus={true}
          required={true}
        />
        <InputNext
          className={styles.input}
          id={`${id}_correctAnswer`}
          name={"correctAnswer"}
          onChange={this.props.onChange}
          placeholder="Correct Answer"
          label={`Correct Answer`}
          value={this.props.correctAnswer}
          htmlAutoFocus={true}
          required={true}
        />
      </div>
    );
  }

  private renderOptionsFields() {
    const { id } = this.props;

    return (
      <div>
        <InputNext
          className={styles.input}
          id={`${id}_question`}
          name={"question"}
          onChange={this.props.onChange}
          placeholder="question"
          label={`Question`}
          value={this.props.question}
          htmlAutoFocus={true}
          required={true}
        />
        <InputNext
          onChange={this.handleChange}
          id={`${id}_options`}
          type={"text"}
          value={this.state.optionsInput}
          label={"Options"}
          name={"optionsInput"}
          onKeyUp={this.handleKeyUp}
        />
        <div className="list-group">
          {this.state.options.map((option, idx) => (
            <OptionAnswer
              onRemove={this.handleOptionRemove}
              key={idx}
              value={option}
              id={String(idx)}
            />
          ))}
        </div>
        {this.state.options.length > 0 && this.renderCorrectAnswer()}
      </div>
    );
  }

  private handleOptionRemove = (opt: string) => {
    let options = this.state.options;

    options = options.filter(x => x !== opt);

    this.setState({ options });
  };

  private renderCorrectAnswer() {
    const { id } = this.props;
    const optionsValues: any[] = [];

    this.state.options.map((option, idx) =>
      optionsValues.push({
        title: option || "",
        value: idx || ""
      })
    );

    return (
      <div className={styles.Wrapper}>
        <br />
        <label htmlFor={`${id}_correctAnswer`} className={styles.dates}>
          Correct Answer
        </label>
        <Select
          id={`${id}_correctAnswer`}
          name={"correctAnswer"}
          value={this.props.correctAnswer}
          label={""}
          options={optionsValues}
          onChange={this.props.onChange}
        />
      </div>
    );
  }

  private renderCommentFields() {
    const { id } = this.props;

    return (
      <div>
        <InputNext
          className={styles.input}
          id={`${id}_post`}
          name={"post"}
          onChange={this.props.onChange}
          placeholder="post title"
          label={`Post To Comment`}
          value={this.props.post}
          htmlAutoFocus={true}
          required={true}
        />
      </div>
    );
  }
}
export default CreateGroupInfoForm;
