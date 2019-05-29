import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider';
import styles from './Range.module.css';

export type Props = {
  className?: string;
  min: number;
  max: number;
  value: number;
  step: number;
  orientation: 'vertical' | 'horizontal';
  onChange: (value: number) => any;
};

class Range extends PureComponent<Props> {
  public static defaultProps = {
    max: 1,
    min: 0,
    orientation: 'horizontal',
    step: 0.01,
    value: 0
  };

  public render() {
    const { min, max, step, value, orientation } = this.props;
    const className = classNames(styles.container, this.props.className);

    return (
      <div className={className}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          orientation={orientation}
          reverse={false}
          tooltip={false}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default Range;
