import React from "react";
import classNames from "classnames/bind";
import styles from "./Upload.module.scss";
import { Form, Input, Select, Button, Upload, Icon } from "antd";
import UploadIcon from "img/gene.png";

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
        uploadInfo,
        validationCheck,
        checkNumber
      } = this.props;
      const { getFieldDecorator } = this.props.form;

      return (
        <Form>
          <div className={cx("full-item")}>
            <Item className={cx("half-item")}>
              <div className={cx("item-title")}>File Name Pattern</div>
              {getFieldDecorator("namePattern", {
                initialValue: "",
                rules: [
                  {
                    required: false,
                    message: "Please input file pattern"
                  }
                ]
              })(<Input />)}
            </Item>
            <Item className={cx("half-item")}>
              <div className={cx("item-title")}>File Index Pattern</div>
              {getFieldDecorator("indexPattern", {
                // initialValue: "_L001_",
                rules: [
                  {
                    required: true,
                    message: "Please input file pattern"
                  }
                ]
              })(<Input />)}
            </Item>
          </div>
          <Item>
            <div className={cx("item-title")}>
              Sequencing Data (Paired-end reads)
            </div>
            {getFieldDecorator("files", {
              rules: [{ required: true, message: "Please submit files" }]
            })(
              <Dragger {...uploadInfo}>
                <p className={cx("upload-icon")}>
                  <img src={UploadIcon} />
                </p>
                <p className={cx("upload-text")}>
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            )}
          </Item>
          <Item>
            <div className={cx("item-title")}>Reference Amplicon Sequence</div>
            {getFieldDecorator("fullseq", {
              // initialValue:
              // "GGACGTCTGCCCAATATGTAAAATAACGGAATGAATGGATTCCTTGGAAACAATGATAACAAGACCTGGCTGAGCTAACTGTGACAGCATGTGGTAATTTTCCAGCCCGCTGGCCCTGTAAAGGAAACTGGAACACAAAGCATAGACTGCGGGGCGGGCCAGCCTGAATAGCTGCAAACAAGTGCAGAATATCTGATGATGTCATACGCACAGTTTGACAGATG",
              rules: [{ required: true, message: "Please input Full Sequence" }]
            })(<TextArea />)}
          </Item>
          {/* <Item>
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
          </Item> */}
          <Item>
            <div className={cx("item-title")}>Used Cas otholog</div>
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
              // initialValue: "ACCTCAGTTCCCCTTCAAAG",
              rules: [
                { required: true, message: "Please input target DNA sequence" }
              ]
            })(<Input />)}
          </Item>
          <Item>
            <div className={cx("item-title")}>Standard Range</div>
            {getFieldDecorator("end_range", {
              initialValue: "70",
              rules: [
                { required: true, message: "Please input range" },
                { validator: checkNumber }
              ]
            })(<Input />)}
          </Item>
          <Item>
            <div className={cx("item-title")}>Target Nucleotide</div>
            {getFieldDecorator("targetSeq", {
              // initialValue: "a",
              rules: [
                { required: true, message: "Please input target" },
                { validator: validationCheck }
              ]
            })(<Input />)}
          </Item>
          <Item>
            <div className={cx("item-title")}>
              Desired change of target nucleotide
            </div>
            {getFieldDecorator("changeSeq", {
              // initialValue: "g",
              rules: [
                { required: true, message: "Please input change" },
                { validator: validationCheck }
              ]
            })(<Input />)}
          </Item>
          <div className={cx("button-box")}>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Form>
      );
    }
  }
);
