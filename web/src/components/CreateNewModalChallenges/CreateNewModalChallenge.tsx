import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, { ChangeEvent, MouseEvent, PureComponent } from "react";
import { dictionary, LanguageContext } from "../../utils/language";
import Button from "../Button/Button";
import HotKeys from "../HotKeys/HotKeys";
import IconButton from "../IconButton/IconButton";
import { HTMLAbstractInputElement } from "../InputNext/InputNext";
import {
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalProvider
} from "../Modal/index";
import Modal from "../Modal/Modal";
import CreateGroupInfoForm from "./CreateGroupInfoForm";
import CreateGroupTypeForm from "./CreateGroupTypeForm";
import styles from "./CreateNewModal.module.css";
import { Props } from "./types";

type CreateNewModalState = {
  isPublic: boolean;
};

class CreateNewModalChallenge extends PureComponent<
  Props,
  CreateNewModalState
> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    id: "create_new_challenge_modal",
    isMaxGroupSizeVisible: false,
    isPublicGroupEnabled: true
  };

  public state = {
    isPublic: false
  };

  public render() {
    const className = classNames(styles.container, this.props.className);

    return (
      <HotKeys onHotKey={this.handleHotKey}>
        <ModalProvider>
          <Modal className={className} onClose={this.props.onClose}>
            {this.renderStep()}
          </Modal>
        </ModalProvider>
      </HotKeys>
    );
  }

  private handlePrevStepClick = (): void => {
    const { step } = this.props;
    if (step === "info") {
      this.props.onStepChange("type");
    }
  };

  private handleNextStepClick = (): void => {
    const { step } = this.props;

    if (step === "type") {
      this.props.onStepChange("info");
    }
  };

  private handleChange = (value: string, { target }: ChangeEvent) => {
    console.log((target as HTMLAbstractInputElement).name);
    this.props.onRequestChange({
      ...this.props.request,
      [(target as HTMLAbstractInputElement).name]: value
    });
  };

  private handleSubmit = (event?: MouseEvent): void => {
    if (event) {
      event.preventDefault();
    }

    this.props.onSubmit({
      ...this.props.request
    });
  };

  private handleHotKey = (hotKey: string, event: KeyboardEvent): void => {
    if (hotKey === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      this.handleNextStepClick();
    }
  };

  private renderError() {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div className={styles.error}>
        {dictionary.error_occurred[this.context]}
      </div>
    );
  }

  private handleOptionChange = (opt: string) => {
    const options = this.props.request.options;

    if (options.includes(opt)) {
      for (let i = 0; i < options.length; i++) {
        if (options[i] === opt) {
          options.splice(i, 1);
          break;
        }
      }
    } else {
      options.push(opt);
    }
    this.props.onRequestChange({
      ...this.props.request,
      options
    });
  };

  private renderTypeStep() {
    const {
      id,
      maxGroupSize,
      request: { type },
      step
    } = this.props;

    return (
      <div className={styles.wrapper}>
        <ModalHeader className={styles.header} withBorder={true}>
          {dictionary.new_challenge[this.context]}
          <ModalClose
            pending={this.props.pending}
            onClick={this.props.onClose}
            id={`${this.props.id}_close_button`}
          />
        </ModalHeader>
        {this.renderError()}
        <ModalBody className={styles.body}>
          <CreateGroupTypeForm
            id={id}
            type={type}
            maxGroupSize={maxGroupSize}
            onChange={this.handleChange}
            context={this.context}
          />
        </ModalBody>
        <ModalFooter className={styles.footer}>
          <Button
            wide={true}
            form={id}
            id={`${id}_step_${step}_submit_button`}
            type={"submit"}
            theme={"success"}
            rounded={false}
            onClick={this.handleNextStepClick}
          >
            {dictionary.next[this.context]}
          </Button>
        </ModalFooter>
      </div>
    );
  }

  private titleModal(type: string) {
    switch (type) {
      case "post":
        return dictionary.post_create[this.context];
      case "question":
        return dictionary.simple_question[this.context];
      case "options":
        return dictionary.mult_choice_question[this.context];
      case "comment":
        return dictionary.comment_post[this.context];
      default:
        return null;
    }
  }

  private renderInfoStep() {
    const { id, step, request } = this.props;

    return (
      <div className={styles.wrapper}>
        <ModalHeader className={styles.header} withBorder={true}>
          <IconButton
            glyph={faArrowLeft}
            size={"small"}
            iconSize={"lg"}
            className={styles.back}
            onClick={this.handlePrevStepClick}
          />
          {dictionary.new_mp[this.context]} {this.titleModal(request.type)}
          <ModalClose
            pending={this.props.pending}
            onClick={this.props.onClose}
            id={`${this.props.id}_close_button`}
          />
        </ModalHeader>
        {this.renderError()}
        <ModalBody className={styles.body}>
          <CreateGroupInfoForm
            vertical={true}
            id={id}
            type={request.type}
            about={request.about}
            title={request.title}
            dateStart={request.dateStart}
            dateEnd={request.dateEnd}
            prize={request.prize}
            prizePoints={request.prizePoints}
            post={request.post}
            posts={this.props.posts}
            question={request.question}
            correctAnswer={request.correctAnswer}
            options={request.options}
            onChange={this.handleChange}
            onSubmit={this.handleNextStepClick}
            onOptionChange={this.handleOptionChange}
            isPublicGroupEnabled={this.props.isPublicGroupEnabled}
          />
        </ModalBody>
        <ModalFooter className={styles.footer}>
          <Button
            wide={true}
            id={`${id}_step_${step}_submit_button`}
            type={"submit"}
            theme={"success"}
            rounded={false}
            onClick={this.handleSubmit}
          >
            {dictionary.finish[this.context]}
          </Button>
        </ModalFooter>
      </div>
    );
  }

  private renderStep() {
    const { step } = this.props;

    switch (step) {
      case "type":
        return this.renderTypeStep();
      case "info":
        return this.renderInfoStep();
      default:
        return null;
    }
  }
}

export default CreateNewModalChallenge;
