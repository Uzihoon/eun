import React from "react";
import classNames from "classnames/bind";
import styles from "./Upload.module.scss";
import { Form, Input, Select, Button, Upload, Icon } from "antd";

const Item = Form.Item;
const TextArea = Input.TextArea;
const Dragger = Upload.Dragger;
const Option = Select.Option;

const cx = classNames.bind(styles);

export default Form.create({ name: "upload" })(
  class extends React.Component {
    render() {
      const {
        nucleaseTypeList,
        nucleaseList,
        handleSubmit,
        uploadInfo
      } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Form>
          <Item>
            <div className={cx("item-title")}>Sequencing Data</div>
            {getFieldDecorator("files", {
              rules: [{ required: true, message: "Please submit files" }]
            })(
              <Dragger {...uploadInfo}>
                <p>
                  <Icon type="inbox" />
                </p>
                <p>Click or drag file to this area to upload</p>
              </Dragger>
            )}
          </Item>
          <Item>
            <div className={cx("item-title")}>Full reference sequence</div>
            {getFieldDecorator("fullseq", {
              initialValue: "GGACGTCTGCCCAATATGTAAAATAACGGAATGAATGGATTCCTTGGAAACAATGATAACAAGACCTGGCTGAGCTAACTGTGACAGCATGTGGTAATTTTCCAGCCCGCTGGCCCTGTAAAGGAAACTGGAACACAAAGCATAGACTGCGGGGCGGGCCAGCCTGAATAGCTGCAAACAAGTGCAGAATATCTGATGATGTCATACGCACAGTTTGACAGATG",
              rules: [{ required: true, message: "Please input Full Sequence" }]
            })(<TextArea />)}
          </Item>
          <Item>
            <div className={cx("item-title")}>Nuclease Type</div>
            {getFieldDecorator("nuctype", {
              initialValue: nucleaseTypeList[0].value
            })(
              <Select>
                {nucleaseTypeList.map((e, i) => (
                  <Option key={e.value} value={e.value}>
                    {e.title}
                  </Option>
                ))}
              </Select>
            )}
          </Item>
          <Item>
            <div className={cx("item-title")}>Select Nuclease</div>
            {getFieldDecorator("nucleases", {
              initialValue: nucleaseList[0].value
            })(
              <Select placeholder="Select Nucleases">
                {nucleaseList.map((e, i) => (
                  <Option key={e.value} value={e.value}>
                    {e.title}
                  </Option>
                ))}
              </Select>
            )}
          </Item>
          <Item>
            <div className={cx("item-title")}>
              Target DNA sequence (5 to 3, without PAM sequence)
            </div>
            {getFieldDecorator("rgenseq", {
              initialValue: "GAACACAAAGCATAGACTGC",
              rules: [
                { required: true, message: "Please input target DNA sequence" }
              ]
            })(<Input />)}
          </Item>
          <Item>
            <div className={cx("item-title")}>Target</div>
            {getFieldDecorator("targetSeq", {
              rules: [
                {required: true, message: "Please input target"}
              ]
            })(<Input/>)}
          </Item>
          <Item>
            <div className={cx("item-title")}>Change</div>
            {getFieldDecorator("changeSeq", {
              rules: [
                {required: true, message: "Please input change"}
              ]
            })(<Input/>)}
          </Item>
          <div className={cx("button-box")}>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Form>
      );
    }
  }
);
