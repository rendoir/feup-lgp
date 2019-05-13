import classNames from "classnames";
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PureComponent
} from "react";
import InputNext, { HTMLAbstractInputElement } from "../InputNext/InputNext";
import OptionAnswer from "../OptionAnswer/OptionAnswer";
import Select from "../Select/Select";
import styles from "./CreateNewModal.module.css";

// - Import utils
import { dictionary, LanguageContext } from "../../utils/language";

export type Props = {
  id: string;
  type: "question" | "options" | "post" | "comment";
  title: string;
  about: string;
  dateStart: string;
  dateEnd: string;
  prize: string;
  prizePoints: string;
  post: string;
  posts?: any[];
  question: string;
  correctAnswer: string;
  options: string[];
  className?: string;
  vertical: boolean;
  isPublicGroupEnabled: boolean;
  aboutMaxLength?: number;
  onSubmit: (event: Event) => void;
  onChange: (value: string, event: ChangeEvent) => void;
  onOptionChange: (opt: string) => any;
};

export type State = {
  options: string[];
  optionsInput: string;
};

class CreateGroupInfoForm extends PureComponent<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    about: "",
    aboutMaxLength: 3000,
    dateEnd: "",
    dateStart: "",
    pointsPrize: "",
    prize: "",
    title: "",
    vertical: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      options: [],
      optionsInput: ""
    };
  }

  public render() {
    const {
      id,
      type,
      about,
      aboutMaxLength,
      title,
      vertical,
      prize,
      prizePoints
    } = this.props;

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
            placeholder={dictionary.challenge_title[this.context]}
            label={dictionary.title[this.context]}
            value={title}
            htmlAutoFocus={true}
            required={true}
          />
          <InputNext
            className={styles.input}
            id={`${id}_about`}
            name={"about"}
            onChange={this.props.onChange}
            placeholder={dictionary.chal_description_placeholder[this.context]}
            label={dictionary.description[this.context]}
            type={"textarea"}
            rows={5}
            value={about || ""}
            maxLength={aboutMaxLength}
            required={true}
          />
          <div id={`${id}_challenge_dates`}>
            <label htmlFor={`${id}_challenge_dates`} className={styles.dates}>
              {dictionary.dates[this.context]}
            </label>
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_date_start`}
              value={this.props.dateStart}
              name={"dateStart"}
              label={dictionary.date_start[this.context]}
              type={"datetime-local"}
              required={true}
            />
            <InputNext
              onChange={this.props.onChange}
              id={`${id}_challenge_date_end`}
              value={this.props.dateEnd}
              name={"dateEnd"}
              label={dictionary.date_end[this.context]}
              type={"datetime-local"}
              required={true}
            />
          </div>
          <div id={`${id}_challenge_prize`}>
            <label htmlFor={`${id}_challenge_prize`} className={styles.dates}>
              {dictionary.prize[this.context]}
            </label>
            <InputNext
              className={styles.input}
              onChange={this.props.onChange}
              id={`${id}_challenge_prize_description`}
              value={prize}
              placeholder={dictionary.prize_desc[this.context]}
              name={"prize"}
              label={dictionary.prize[this.context]}
              type={"text"}
              required={true}
            />
            <InputNext
              className={styles.input}
              onChange={this.props.onChange}
              id={`${id}_challenge_prize_points`}
              value={prizePoints}
              placeholder={dictionary.points_desc[this.context]}
              name={"prizePoints"}
              label={dictionary.points[this.context]}
              type={"text"}
              required={true}
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
      this.props.onOptionChange(this.state.optionsInput);
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
          placeholder={dictionary.question[this.context]}
          label={dictionary.question[this.context]}
          value={this.props.question}
          htmlAutoFocus={true}
          required={true}
        />
        <InputNext
          className={styles.input}
          id={`${id}_correctAnswer`}
          name={"correctAnswer"}
          onChange={this.props.onChange}
          placeholder={dictionary.correct_answer[this.context]}
          label={dictionary.correct_answer[this.context]}
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
          placeholder={dictionary.question[this.context]}
          label={dictionary.question[this.context]}
          value={this.props.question}
          htmlAutoFocus={true}
          required={true}
        />
        <InputNext
          onChange={this.handleChange}
          id={`${id}_options`}
          type={"text"}
          value={this.state.optionsInput}
          label={dictionary.options[this.context]}
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
    this.props.onOptionChange(opt);
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
          {dictionary.correct_answer[this.context]}
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
    const postValues: any[] = [];

    if (this.props.posts === undefined) {
      return null;
    }

    this.props.posts.map(post =>
      postValues.push({
        title: post.title || "",
        value: post.id || ""
      })
    );

    return (
      <div className={styles.Wrapper}>
        <br />
        <label htmlFor={`${id}_post`} className={styles.dates}>
          {dictionary.post_to_com[this.context]}
        </label>
        <Select
          id={`${id}_post`}
          name={"post"}
          value={this.props.post}
          label={""}
          options={postValues}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
export default CreateGroupInfoForm;
