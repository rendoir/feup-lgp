import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, { ChangeEvent, MouseEvent, PureComponent } from "react";
import Button from "../Button/Button";
import HotKeys from "../HotKeys/HotKeys";
import IconButton from "../IconButton/IconButton";
import ImageEdit from "../ImageEdit/ImageEdit";
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

class CreateNewModal extends PureComponent<Props, CreateNewModalState> {
  public static defaultProps = {
    id: "create_new_modal",
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

  private handleAvatarChange = (avatar: File): void => {
    this.props.onRequestChange({
      ...this.props.request,
      avatar
    });
    this.props.onStepChange("info");
  };

  private handleAvatarRemove = (): void => {
    this.props.onRequestChange({
      ...this.props.request,
      avatar: undefined
    });
  };

  private handleAvatarEdit = (avatar: File): void => {
    this.props.onRequestChange({
      ...this.props.request,
      avatar
    });
    this.props.onStepChange("avatar");
  };

  private handleSubmit = (event?: MouseEvent): void => {
    if (event) {
      event.preventDefault();
    }

    this.props.onSubmit({
      ...this.props.request
    });
  };

  private handleCancelAvatarEdit = (): void => {
    this.props.onStepChange("info");
  };

  private handleHotKey = (hotKey: string, event: KeyboardEvent): void => {
    if (hotKey === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      this.handleNextStepClick();
    }
  };

  private handleFileChange = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const images: File[] = [];
    const videos: File[] = [];
    const docs: File[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith("image")) {
        images.push(file);
      } else if (file.type.startsWith("video")) {
        videos.push(file);
      } else {
        docs.push(file);
      }
    });

    this.props.onRequestChange({
      ...this.props.request,
      files: {
        docs,
        images,
        videos
      }
    });
  };

  private handleTagChange = (tag: string) => {
    const tags = this.props.request.tags;

    if (tags.includes(tag)) {
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] === tag) {
          tags.splice(i, 1);
          break;
        }
      }
    } else {
      tags.push(tag);
    }
    this.props.onRequestChange({
      ...this.props.request,
      tags
    });
  };

  private renderError() {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return <div className={styles.error}>An error occurred</div>;
  }

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
          New {type}
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
            Next
          </Button>
        </ModalFooter>
      </div>
    );
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
          New {request.type}
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
            local={request.local}
            dateStart={request.dateStart}
            dateEnd={request.dateEnd}
            livestream={request.livestream}
            switcher={request.switcher}
            privacy={request.privacy}
            tags={this.props.tags}
            avatar={request.avatar}
            onChange={this.handleChange}
            onSubmit={this.handleNextStepClick}
            onAvatarRemove={this.handleAvatarRemove}
            onAvatarChange={this.handleAvatarEdit}
            onFileChange={this.handleFileChange}
            onTagChange={this.handleTagChange}
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
            Finish
          </Button>
        </ModalFooter>
      </div>
    );
  }

  private renderAvatarStep() {
    const {
      request: { avatar }
    } = this.props;

    if (avatar) {
      return (
        <div className={styles.wrapper}>
          <ModalHeader className={styles.header} withBorder={true}>
            <IconButton
              glyph={faArrowLeft}
              onClick={this.handleCancelAvatarEdit}
              className={styles.back}
              id={`${this.props.id}_back_button`}
            />
            Edit Avatar
            <ModalClose
              pending={this.props.pending}
              onClick={this.props.onClose}
              id={`${this.props.id}_close_button`}
            />
          </ModalHeader>
          {this.renderError()}
          <ModalBody className={styles.body}>
            <ImageEdit
              image={avatar}
              type={"circle"}
              size={250}
              height={400}
              onSubmit={this.handleAvatarChange}
            />
          </ModalBody>
        </div>
      );
    }

    return null;
  }

  private renderStep() {
    const { step } = this.props;

    switch (step) {
      case "type":
        return this.renderTypeStep();
      case "info":
        return this.renderInfoStep();
      case "avatar":
        return this.renderAvatarStep();
      default:
        return null;
    }
  }
}

export default CreateNewModal;
