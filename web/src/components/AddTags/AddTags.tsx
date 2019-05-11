import axios from "axios";
import React, { ChangeEvent, Component, MouseEvent, ReactNode } from "react";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { dictionary, LanguageContext } from "../../utils/language";
import { ColorTheme } from "../../utils/types";
import Icon from "../Icon/Icon";
import styles from "./AddTags.module.css";

export type Option = {};

export interface IProps {
  tags: any[];

  onChange: (valueToChange: any[], value: any[]) => any;
}

export interface IState {
  tags: any[];
  suggested_tags: any[];
}

class AddTags extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  public tagInput: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      suggested_tags: [],
      tags: []
    };
  }

  public render() {
    return (
      <div className={styles.input_tag}>
        <ul className={styles.input_tag__tags}>
          {this.state.tags.map((tag, i) => (
            <li key={tag}>
              #{tag}
              <button
                type="button"
                onClick={() => {
                  this.removeTag(i);
                }}
              >
                <i className="fa fa-times fa-xs" />
              </button>
            </li>
          ))}
          <li id="tags_input" className={styles.input_tag__tags__input}>
            <input
              type="text"
              className={this.getInputRequiredClass("tags")}
              list="suggested-tags"
              placeholder={dictionary.tag_placeholder[this.context]}
              onKeyDown={this.onSpacePress}
              ref={c => {
                this.tagInput = c;
              }}
            />
            <datalist id="suggested-tags">
              {this.state.suggested_tags.map((tag, key) => (
                <option key={"tag_" + key} value={tag.name} />
              ))}
            </datalist>
          </li>
        </ul>
      </div>
    );
  }

  public componentDidMount() {
    this.getExistentTags();
  }

  public getExistentTags() {
    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += `/tags`;

    axios
      .get(getUrl)
      .then(res => {
        this.setState({
          suggested_tags: res.data,
          tags: this.props.tags
        });
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public onSpacePress = (e: any) => {
    const val = e.target.value;
    if (e.keyCode === 13 && e.shiftKey === false && val) {
      if (
        this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val] });
      this.tagInput.value = null;
      this.props.onChange(this.props.tags, [...this.state.tags, val]);
      e.preventDefault();
    } else if (e.key === "Backspace" && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
  };

  public removeTag = (i: any) => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
    this.props.onChange(this.props.tags, newTags);
  };
}

export default AddTags;
