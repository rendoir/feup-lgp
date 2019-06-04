import React, { PureComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import { dictionary, LanguageContext } from '../../utils/language';
import Tag from '../Tags/Tag';
import { Request, Step } from './types';

export type Props = {
  id: string;
  centered: boolean;
  onChange: (request: Request) => any;
  onClose: () => any;
  onStepChange: (step: Step) => any;
  onSubmit: (request: Request) => any;
  request: Request;
  show: boolean;
  step: Step;
  tags?: string[];
};

export type State = {
  error: {
    dateEnd: boolean;
    dateEndStart: boolean;
    dateFromNowEnd: boolean;
    dateFromNowStart: boolean;
    dateStart: boolean;
    description: boolean;
    local: boolean;
    tags: boolean;
    title: boolean;
    visibility: boolean;
  };
  tag: string;
};

class CreateNewModal extends PureComponent<Props, State> {
  public static contextType = LanguageContext;
  public static defaultProps = {
    centered: true,
    id: 'create_new_modal',
    show: false,
    step: 'type'
  };
  private readonly emptyRequest: object;

  constructor(props: Props) {
    super(props);

    this.emptyRequest = {
      avatar: undefined,
      dateEnd: '',
      dateStart: '',
      description: '',
      files: {
        docs: [],
        images: [],
        videos: []
      },
      local: '',
      tags: [],
      title: '',
      visibility: 'public'
    };

    this.state = {
      error: {
        dateEnd: false,
        dateEndStart: false,
        dateFromNowEnd: false,
        dateFromNowStart: false,
        dateStart: false,
        description: false,
        local: false,
        tags: false,
        title: false,
        visibility: false
      },
      tag: ''
    };
  }

  public render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onClose}
        centered={this.props.centered}
      >
        {this.renderHeader()}
        <Modal.Body className={'pb-5'}>{this.renderStep()}</Modal.Body>
        {this.renderFooter()}
      </Modal>
    );
  }

  /**
   * Components
   */

  private renderStep = () => {
    const {
      step,
      request: { type }
    } = this.props;

    switch (step) {
      case 'type':
        return this.renderTypeStep();
      case 'info':
        return type === 'post'
          ? this.renderPostStep()
          : this.renderConferenceStep();
      default:
        return null;
    }
  };

  private renderHeader = () => {
    const { type } = this.props.request;

    return (
      <Modal.Header
        closeButton={true}
        className={'d-flex flex-row align-items-center'}
      >
        {this.props.step === 'info' ? (
          <Button
            variant={'light'}
            className={'mr-2'}
            onClick={this.handlePrevStepClick}
            size={'sm'}
          >
            <i className={'fas fa-chevron-circle-left'} />
          </Button>
        ) : null}
        <Modal.Title>
          {`${dictionary.new_f[this.context]} ${
            dictionary[type][this.context]
          }`}
        </Modal.Title>
      </Modal.Header>
    );
  };

  private renderTypeStep = () => {
    const {
      id,
      request: { type }
    } = this.props;

    return (
      <Form id={id}>
        <Form.Check
          type={'radio'}
          onChange={this.handleChange}
          label={dictionary.post_cap[this.context]}
          name={'type'}
          value={'post'}
          checked={type === 'post'}
          id={`${id}_type_post`}
          className={'font-weight-bold h5'}
        />
        <p className={'text-muted mx-4 mb-5'}>
          {dictionary.post_description[this.context]}
        </p>
        <Form.Check
          type={'radio'}
          onChange={this.handleChange}
          label={dictionary.conference_cap[this.context]}
          name={'type'}
          value={'conference'}
          checked={type === 'conference'}
          id={`${id}_type_conference`}
          className={'font-weight-bold h5'}
        />
        <p className={'text-muted mx-4'}>
          {dictionary.conference_description[this.context]}
        </p>
      </Form>
    );
  };

  private renderPostStep = () => {
    const { id } = this.props;

    return (
      <Form id={`${id}_post`}>
        <Form.Group controlId={`${id}_post.title`}>
          <Form.Label column={false}>
            {dictionary.title[this.context]}
          </Form.Label>
          <Form.Control
            type={'text'}
            placeholder={dictionary.insert_title[this.context]}
            name={'title'}
            value={this.props.request.title}
            onChange={this.handleChange}
            autoFocus={true}
            isValid={
              !this.state.error.title &&
              this.props.request.title.trim().length > 0
            }
            isInvalid={this.state.error.title}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.title_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId={`${id}_post.description`}>
          <Form.Label column={false}>
            {dictionary.description[this.context]}
          </Form.Label>
          <Form.Control
            as={'textarea'}
            placeholder={dictionary.description_placeholder[this.context]}
            rows={'8'}
            name={'description'}
            value={this.props.request.description}
            onChange={this.handleChange}
            isValid={
              !this.state.error.description &&
              this.props.request.description.trim().length > 0
            }
            isInvalid={this.state.error.description}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.description_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId={`${id}_post.visibility`}>
          <Form.Label column={false}>
            {dictionary.visibility[this.context]}
          </Form.Label>
          <Form.Control
            as={'select'}
            name={'visibility'}
            value={this.props.request.visibility}
            onChange={this.handleChange}
            isInvalid={this.state.error.visibility}
          >
            <option value={'public'}>
              {dictionary.visibility_public[this.context]}
            </option>
            <option value={'followers'}>
              {dictionary.visibility_followers[this.context]}
            </option>
            <option value={'private'}>
              {dictionary.visibility_private[this.context]}
            </option>
          </Form.Control>
          <FormControl.Feedback type={'invalid'}>
            {dictionary.visibility_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId={`${id}_post.tags`}>
          <Form.Label column={false}>
            {dictionary.tags[this.context]}
          </Form.Label>
          <Form.Control
            type={'text'}
            placeholder={dictionary.tag_placeholder[this.context]}
            name={'tags'}
            value={this.state.tag}
            onChange={this.handleTagChange}
            onKeyUp={this.handleTagAdd}
            list={'possible_tags'}
            isInvalid={this.state.error.tags}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.tag_invalid_field[this.context]}
          </FormControl.Feedback>
          <datalist id={'possible_tags'}>
            {this.props.tags!.map((tag, idx) => (
              <option key={`tag_${idx}`} value={tag} />
            ))}
          </datalist>
          {this.props.request.tags!.map((tag, idx) => (
            <Tag
              key={idx}
              onRemove={this.handleTagRemove}
              value={tag}
              id={String(idx)}
              className={'m-1'}
            />
          ))}
        </Form.Group>
        <Form.Group controlId={`${id}_post.files`}>
          <Form.Label column={false}>
            {dictionary.files[this.context]}
          </Form.Label>
          <Form.Control
            type={'file'}
            placeholder={dictionary.insert_files[this.context]}
            name={'files'}
            multiple={true}
            onChange={this.handleFileChange}
          />
        </Form.Group>
      </Form>
    );
  };

  private renderConferenceStep = () => {
    const { id } = this.props;

    return (
      <Form id={`${id}_conference`}>
        <Form.Group controlId={`${id}_conference.title`}>
          <Form.Label column={false}>
            {dictionary.title[this.context]}
          </Form.Label>
          <Form.Control
            type={'text'}
            placeholder={dictionary.insert_title[this.context]}
            name={'title'}
            value={this.props.request.title}
            onChange={this.handleChange}
            autoFocus={true}
            isValid={
              !this.state.error.title &&
              this.props.request.title.trim().length > 0
            }
            isInvalid={this.state.error.title}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.title_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId={`${id}_conference.description`}>
          <Form.Label column={false}>
            {dictionary.description[this.context]}
          </Form.Label>
          <Form.Control
            as={'textarea'}
            placeholder={dictionary.description_placeholder[this.context]}
            rows={'8'}
            maxLength={3000}
            name={'description'}
            value={this.props.request.description}
            onChange={this.handleChange}
            isValid={
              !this.state.error.description &&
              this.props.request.description.trim().length > 0
            }
            isInvalid={this.state.error.description}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.description_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId={`${id}_conference.visibility`}>
          <Form.Label column={false}>
            {dictionary.visibility[this.context]}
          </Form.Label>
          <Form.Control
            as={'select'}
            name={'visibility'}
            value={this.props.request.visibility}
            onChange={this.handleChange}
            isInvalid={this.state.error.visibility}
          >
            <option value={'public'}>
              {dictionary.visibility_public[this.context]}
            </option>
            <option value={'followers'}>
              {dictionary.visibility_followers[this.context]}
            </option>
            <option value={'private'}>
              {dictionary.visibility_private[this.context]}
            </option>
          </Form.Control>
          <FormControl.Feedback type={'invalid'}>
            {dictionary.visibility_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label column={false}>
            {dictionary.location[this.context]}
          </Form.Label>
          <Form.Control
            type={'text'}
            name={'local'}
            placeholder={dictionary.conference_local[this.context]}
            value={this.props.request.local}
            onChange={this.handleChange}
            isValid={
              !this.state.error.local &&
              this.props.request.local!.trim().length > 0
            }
            isInvalid={this.state.error.local}
          />
          <FormControl.Feedback type={'invalid'}>
            {dictionary.local_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label column={false}>
            {dictionary.date_start[this.context]}
          </Form.Label>
          <Form.Control
            type={'datetime-local'}
            name={'dateStart'}
            placeholder={dictionary.starting_date[this.context]}
            value={this.props.request.dateStart}
            onChange={this.handleChange}
            isValid={
              this.props.request.dateStart!.trim().length > 0 &&
              !this.state.error.dateFromNowStart &&
              !this.state.error.dateStart
            }
            isInvalid={
              this.state.error.dateFromNowStart || this.state.error.dateStart
            }
          />
          <FormControl.Feedback type={'invalid'}>
            {this.state.error.dateFromNowStart
              ? dictionary.date_from_now_error[this.context]
              : dictionary.date_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label column={false}>
            {dictionary.date_end[this.context]}
          </Form.Label>
          <Form.Control
            type={'datetime-local'}
            name={'dateEnd'}
            placeholder={dictionary.ending_date[this.context]}
            value={this.props.request.dateEnd}
            onChange={this.handleChange}
            isValid={
              this.props.request.dateEnd!.trim().length > 0 &&
              !this.state.error.dateFromNowEnd &&
              !this.state.error.dateEndStart &&
              !this.state.error.dateEnd
            }
            isInvalid={
              this.state.error.dateFromNowEnd ||
              this.state.error.dateEndStart ||
              this.state.error.dateEnd
            }
            min={this.props.request.dateStart}
          />
          <FormControl.Feedback type={'invalid'}>
            {this.state.error.dateFromNowEnd
              ? dictionary.date_from_now_error[this.context]
              : this.state.error.dateEndStart
              ? dictionary.date_end_invalid_field[this.context]
              : dictionary.date_invalid_field[this.context]}
          </FormControl.Feedback>
        </Form.Group>
      </Form>
    );
  };

  private renderFooter = () => {
    const { step } = this.props;

    return (
      <Modal.Footer className={'p-0'}>
        <Button
          onClick={
            step === 'type' ? this.handleNextStepClick : this.handleSubmit
          }
          block={true}
          variant={'success'}
          size={'lg'}
          style={{ borderRadius: '0' }}
        >
          {step === 'type'
            ? dictionary.next[this.context]
            : dictionary.create[this.context]}
        </Button>
      </Modal.Footer>
    );
  };

  /**
   * Handlers
   */

  private handleChange = event => {
    this.fieldValidation(event.target.name, event.target.value);
    this.props.onChange({
      ...this.props.request,
      [event.target.name]: event.target.value
    });
  };

  private handleTagChange = event => {
    this.setState({
      tag: event.target.value
    });
    this.fieldValidation(event.target.name, event.target.value);
  };

  private handleTagAdd = event => {
    if (
      event.key === 'Enter' &&
      !this.state.error.tags &&
      this.state.tag.trim().length > 0
    ) {
      let tags = this.props.request.tags;

      if (tags && !tags.includes(this.state.tag)) {
        tags = [...tags, this.state.tag];
        this.props.onChange({
          ...this.props.request,
          tags
        });
      }

      this.setState({
        tag: ''
      });
    }
  };

  private handleTagRemove = (tag: string) => {
    let tags = this.props.request.tags;

    if (tags) {
      tags = tags.filter(t => t !== tag);
    }

    this.props.onChange({
      ...this.props.request,
      tags
    });
  };

  private handleFileChange = event => {
    const files = event.target.files as FileList;

    if (!files) {
      return;
    }

    const images: File[] = [];
    const videos: File[] = [];
    const docs: File[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image')) {
        images.push(file);
      } else if (file.type.startsWith('video')) {
        videos.push(file);
      } else {
        docs.push(file);
      }
    });

    this.props.onChange({
      ...this.props.request,
      files: {
        docs,
        images,
        videos
      }
    });
  };

  private handlePrevStepClick = () => {
    const { step } = this.props;

    this.props.onChange({
      ...this.props.request,
      ...this.emptyRequest
    });

    this.setState({
      error: {
        dateEnd: false,
        dateEndStart: false,
        dateFromNowEnd: false,
        dateFromNowStart: false,
        dateStart: false,
        description: false,
        local: false,
        tags: false,
        title: false,
        visibility: false
      }
    });

    if (step === 'info') {
      this.props.onStepChange('type');
    }
  };

  private handleNextStepClick = () => {
    const { step } = this.props;

    if (step === 'type') {
      this.props.onStepChange('info');
    }
  };

  private handleSubmit = event => {
    event.preventDefault();

    if (Object.values(this.state.error).includes(true)) {
      return;
    }

    this.props.onSubmit({
      ...this.props.request
    });
  };

  private fieldValidation = (field: string, value: string) => {
    let re;

    switch (field) {
      case 'title':
        re = /^([\s\-!@#$?<>]*[\w\u00C0-\u017F]+[\s\-!@#$?<>]*){2,150}$/;
        break;
      case 'description':
        re = /^[\-!?%@#)(\s]*[\w\u00C0-\u017F]+[\s\-!?@#%,.)(\w\u00C0-\u017F]*$/;
        break;
      case 'local':
        re = /^([\w\u00C0-\u017F]+[ \-,.\w\u00C0-\u017F]*){2,}$/;
        break;
      case 'dateStart':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        break;
      case 'dateEnd':
        re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        break;
      case 'tags':
        re = /^([\s\-]*[\w\u00C0-\u017F]+[\s\-]*){2,150}$/;
        break;
      case 'visibility':
        re = /^public|followers|private$/;
        break;
      default:
        return false;
    }

    this.setState({
      error: {
        ...this.state.error,
        [field]: !re.test(value),
        dateEndStart:
          field === 'dateEnd'
            ? Date.parse(value) <= Date.parse(this.props.request.dateStart!)
            : this.state.error.dateEndStart,
        dateFromNowEnd:
          field === 'dateEnd'
            ? Date.parse(value) < Date.now()
            : this.state.error.dateFromNowEnd,
        dateFromNowStart:
          field === 'dateStart'
            ? Date.parse(value) < Date.now()
            : this.state.error.dateFromNowStart
      }
    });
  };
}

export default CreateNewModal;
