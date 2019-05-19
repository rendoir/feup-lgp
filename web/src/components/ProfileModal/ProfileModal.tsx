import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import React, { ChangeEvent, MouseEvent, PureComponent } from 'react';
import { dictionary, LanguageContext } from '../../utils/language';
import Button from '../Button/Button';
import HotKeys from '../HotKeys/HotKeys';
import IconButton from '../IconButton/IconButton';
import ImageEdit from '../ImageEdit/ImageEdit';
import { HTMLAbstractInputElement } from '../InputNext/InputNext';
import {
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalProvider
} from '../Modal/index';
import Modal from '../Modal/Modal';

import CreateGroupInfoForm from './CreateGroupInfoForm';

import styles from './CreateNewModal.module.css';
import { Props } from './types';

type CreateNewModalState = {
  isPublic: boolean;
};

class ProfileModal extends PureComponent<Props, CreateNewModalState> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    id: 'create_new_modal',
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

  private handleNextStepClick = (): void => {
    const { step } = this.props;
  };

  private handleChange = (value: string, type: string) => {
    this.props.onRequestChange({
      ...this.props.request,
      [type]: value
    });
  };

  private handleAvatarChange = (avatar: File): void => {
    this.props.onRequestChange({
      ...this.props.request,
      avatar
    });
    this.props.onStepChange('profile');
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
    this.props.onStepChange('avatar');
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
    this.props.onStepChange('profile');
  };

  private handleHotKey = (hotKey: string, event: KeyboardEvent): void => {
    if (hotKey === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }

    this.handleNextStepClick();
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
            {dictionary.edit_avatar[this.context]}
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
              type={'circle'}
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

  private renderProfileStep() {
    const { id, step, request } = this.props;

    return (
      <div className={styles.wrapper}>
        <ModalHeader className={styles.header} withBorder={true}>
          {dictionary.edit_profile[this.context]}
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
            avatar={request.avatar}
            email={request.email}
            first_name={request.first_name}
            home_town={request.home_town}
            last_name={request.last_name}
            loading={request.loading}
            old_password={request.old_password}
            password={request.password}
            confirm_password={request.confirm_password}
            university={request.university}
            work={request.work}
            work_field={request.work_field}
            onChange={this.handleChange}
            onSubmit={this.handleNextStepClick}
            onAvatarRemove={this.handleAvatarRemove}
            onAvatarChange={this.handleAvatarEdit}
            isPublicGroupEnabled={this.props.isPublicGroupEnabled}
          />
        </ModalBody>
        <ModalFooter className={styles.footer}>
          <Button
            wide={true}
            id={`${id}_step_${step}_submit_button`}
            type={'submit'}
            theme={'success'}
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
      case 'profile':
        return this.renderProfileStep();
      case 'avatar':
        return this.renderAvatarStep();
      default:
        return null;
    }
  }
}

export default ProfileModal;
