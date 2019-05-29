import { faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Croppie from 'croppie';
import 'croppie/croppie.css';
import React, { MouseEvent, PureComponent, ReactNode } from 'react';
import { fileToBase64 } from '../../utils/fileToBase64';
import { dictionary, LanguageContext } from '../../utils/language';
import { listen } from '../../utils/listen';
import Button from '../Button/Button';
import HotKeys from '../HotKeys/HotKeys';
import Icon from '../Icon/Icon';
import Range from '../Range/Range';
import styles from './ImageEdit.module.css';

type FooterRendererProps = {
  submit: () => any;
};

type ControlsRendererProps = {
  rotateLeft: (event: MouseEvent) => any;
  rotateRight: (event: MouseEvent) => any;
  zoom: {
    onChange: (value: number) => any;
    value: number;
    minZoom: number;
  };
};

export type Props = {
  className?: string;
  image: File;
  type: 'circle' | 'square';
  size: number;
  height: number;
  maxZoom: number;
  onSubmit: (image: File) => any;
  renderFooter?: (footerRenderedProps: FooterRendererProps) => ReactNode;
  renderControls?: (controlsRendererProps: ControlsRendererProps) => ReactNode;
};

export type State = {
  zoom: number;
  minZoom: number;
};

class ImageEdit extends PureComponent<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {
    height: 400,
    maxZoom: 2,
    size: 250,
    type: 'circle'
  };
  private croppieElement: HTMLElement | undefined | null;
  private croppie: Croppie | undefined | null;
  private listeners: (Array<{ remove(): void }>) | undefined | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      minZoom: 0,
      zoom: 0
    };

    this.croppie = null;
    this.listeners = null;
  }

  public render() {
    const className = classNames(styles.container, this.props.className);

    return (
      <HotKeys onHotKey={this.handleHotKey}>
        <div className={className}>
          <div className={styles.body}>
            <div ref={this.setCropper} style={{ height: this.props.height }} />
            {this.renderControls()}
          </div>
          <div className={styles.footer}>{this.renderFooter()}</div>
        </div>
      </HotKeys>
    );
  }

  public componentDidMount(): void {
    if (this.croppieElement) {
      this.croppie = new Croppie(this.croppieElement, {
        customClass: styles.cropper,
        enableOrientation: true,
        showZoomer: false,
        viewport: {
          height: this.props.size,
          type: this.props.type,
          width: this.props.size
        }
      });

      fileToBase64(this.props.image, image => {
        if (this.croppie) {
          this.croppie
            .bind({
              url: image,
              zoom: 0
            })
            .then(() => {
              this.setState(({ zoom }) => {
                const currentZoom = this.croppie
                  ? (this.croppie.get().zoom as number)
                  : zoom;

                return {
                  minZoom: currentZoom,
                  zoom: currentZoom
                };
              });
            });
        }
      });

      this.listeners = [
        listen(this.croppieElement, 'update', this.handleCroppieUpdate, {
          capture: false,
          passive: true
        })
      ];
    }
  }

  public componentWillUnmount(): void {
    this.removeListeners();
    if (this.croppie) {
      this.croppie.destroy();
      this.croppie = null;
    }
  }

  private handleSubmit = (): void => {
    if (this.croppie) {
      this.croppie
        .result({
          circle: false,
          format: 'png',
          size: 'viewport',
          type: 'blob'
        })
        .then(blob => {
          this.props.onSubmit(
            new File([blob], `${new Date().toISOString()}.png`)
          );
        })
        .catch(error => {
          throw new Error(error);
        });
    }
  };

  private handleRotateLeft = (event: MouseEvent): void => {
    event.preventDefault();

    if (this.croppie) {
      this.croppie.rotate(90);
    }
  };

  private handleRotateRight = (event: MouseEvent): void => {
    event.preventDefault();

    if (this.croppie) {
      this.croppie.rotate(-90);
    }
  };

  private handleCroppieUpdate = (event: any) => {
    this.setState({ zoom: event.detail.zoom });
  };

  private handleZoomChange = (value: number) => {
    if (this.croppie) {
      this.croppie.setZoom(value);
    }
  };

  private handleHotKey = (hotKey: string, event: KeyboardEvent): void => {
    if (hotKey === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.handleSubmit();
    }
  };

  private setCropper = (cropper: HTMLElement | null): void => {
    if (cropper) {
      this.croppieElement = cropper;
    }
  };

  private removeListeners = (): void => {
    if (this.listeners) {
      this.listeners.forEach(listener => listener.remove());
      this.listeners = null;
    }
  };

  private renderControls(): ReactNode {
    if (this.props.renderControls) {
      return this.props.renderControls({
        rotateLeft: this.handleRotateLeft,
        rotateRight: this.handleRotateRight,
        zoom: {
          minZoom: this.state.minZoom,
          onChange: this.handleZoomChange,
          value: this.state.zoom
        }
      });
    }

    return (
      <div className={styles.controls}>
        <a href={'#'} onClick={this.handleRotateLeft}>
          <Icon icon={faUndo} className={styles.rotateLeft} size={'lg'} />
        </a>
        <a href={'#'} onClick={this.handleRotateRight}>
          <Icon icon={faRedo} className={styles.rotateRight} size={'lg'} />
        </a>
        <Range
          min={this.state.minZoom}
          max={this.props.maxZoom}
          value={this.state.zoom}
          step={0.001}
          onChange={this.handleZoomChange}
          className={styles.zoom}
        />
      </div>
    );
  }

  private renderFooter(): ReactNode {
    if (this.props.renderFooter) {
      return this.props.renderFooter({ submit: this.handleSubmit });
    }

    return (
      <Button
        wide={true}
        theme={'primary'}
        rounded={false}
        onClick={this.handleSubmit}
      >
        {dictionary.save[this.context]}
      </Button>
    );
  }
}

export default ImageEdit;
