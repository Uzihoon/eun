import React from 'react';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import { Form, Input, Select, Button, Upload, Radio } from 'antd';
import UploadIcon from 'img/gene.png';
import RunIcon from 'img/sample.png';
import FileIcon from 'img/json.png';

const Item = Form.Item;
const TextArea = Input.TextArea;
const Dragger = Upload.Dragger;
const Option = Select.Option;

const cx = classNames.bind(styles);

const tideList = ['A', 'C', 'G', 'T'];

export default Form.create({ name: 'upload' })(
  class extends React.Component {
    render() {
      const {
        nucleaseTypeList,
        nucleaseList,
        handleSubmit,
        uploadInfo,
        validationCheck,
        checkNumber,
        runSample,
        handleJson,
        handleChange,
        setRef,
        sequenceList,
        sampleLoading
      } = this.props;
      const { getFieldDecorator } = this.props.form;
      const aniClass = sampleLoading && 'animation';
      return (
        <Form>
          <div className={cx('header')}>
            <div className={cx('title')}>
              <div className={cx('main')}>Cas Analysis</div>
              <div className={cx('desc')}>
                Cas Analysis provides multi-sample analysis of NGS data.
              </div>
            </div>
            <div className={cx('button-box')}>
              <div className={cx('sample-btn')} onClick={handleJson}>
                <input
                  className={cx('hidden-input')}
                  accept='application/json, .json'
                  type='file'
                  ref={setRef}
                  onChange={handleChange}
                />
                <div className={cx('sample-text')}>Analyze by json file</div>
                <div className={cx('icon')}>
                  <img src={FileIcon} />
                </div>
              </div>
              <div className={cx('sample-btn')} onClick={runSample}>
                <div className={cx('sample-text')}>Run analyze sample file</div>
                <div className={cx('sample')}>
                  <div className={cx('circle-wrapper', 'wrapper-right')}>
                    <div
                      className={cx('circle-whole', 'circle-right', aniClass)}
                    ></div>
                  </div>
                  <div className={cx('circle-wrapper', 'wrapper-left')}>
                    <div
                      className={cx('circle-whole', 'circle-left', aniClass)}
                    ></div>
                  </div>
                  <div className={cx('icon')}>
                    <img src={RunIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('full-item')}>
            <Item className={cx('half-item')}>
              <div className={cx('item-title')}>
                File Name Pattern (Optional)
              </div>
              {getFieldDecorator('namePattern', {
                initialValue: '',
                rules: [
                  {
                    required: false,
                    message: 'Please input file pattern'
                  }
                ]
              })(<Input placeholder='Sample-ID' />)}
            </Item>
            <Item className={cx('half-item')}>
              <div className={cx('item-title')}>File Index Pattern</div>
              {getFieldDecorator('indexPattern', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: 'Please input file pattern'
                  }
                ]
              })(<Input placeholder='_L001_' />)}
            </Item>
          </div>
          <Item>
            <div className={cx('item-title')}>
              Sequencing Data (Paired-end reads)
            </div>
            {getFieldDecorator('files', {
              rules: [{ required: true, message: 'Please submit files' }]
            })(
              <Dragger {...uploadInfo}>
                <p className={cx('upload-icon')}>
                  <img src={UploadIcon} />
                </p>
                <p className={cx('upload-text')}>
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            )}
          </Item>
          <Item>
            <div className={cx('item-title')}>Reference Amplicon Sequence</div>
            {getFieldDecorator('fullseq', {
              // initialValue:
              // 'tagatgggagctcaggctaacatgataccctgaaacctgctgactagcacctcctctccaggacgacttccccagataccccgtgggcaagttcttccaatatgacacctggagacagtccgcgggacgcctgcgcagaggcctgcctgccctcctgcgtgcccgccggggtcgcatgcttgccaaagagctcaaagagttcagagaggccaaacgtc',
              // "GGAGTTTCCAGATCTCTGATGGCCATTTTCCTCGAGCCTGTGCCTCCTCTAAGAACTTGTTGGCAAAAGAATGCTGCCCACCATGGATGGGTGATGGGAGTCCCTGCGGCCAGCTTTCAGGCAGAGGTTCCTGCCAGGATATCCTTCTGTCCAGTGCACCATCTGGACCTCAGTTCCCCTTCAAAGGGGTGGATGACCGTGAGTCCTGGCCCTCTGTGTTTTATAATAGGACCTGCCAGTGC",
              rules: [{ required: true, message: 'Please input Full Sequence' }]
            })(
              <TextArea placeholder='GGAGTTTCCAGATCTCTGATGGCCATTTTCCTCGAGCCTGTGCCTCCTCTAAGAACTTGTTGGCAAAAGAATGCTGCCCACCATGGATGGGTGATGGGAGTCCCTGCGGCCAGCTTTCAGGCAGAGGTTCCTGCCAGGATATCCTTCTGTCCAGTGCACCATCTGGACCTCAGTTCCCCTTCAAAGGGGTGGATGACCGTGAGTCCTGGCCCTCTGTGTTTTATAATAGGACCTGCCAGTGC' />
            )}
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
            <div className={cx('item-title')}>Used Cas Ortholog</div>
            {getFieldDecorator('nucleases', {
              initialValue: nucleaseList[0].value
            })(
              <Select placeholder='Select Nucleases'>
                {nucleaseList.map((e, i) => (
                  <Option key={e.value} value={e.value}>
                    {e.title}
                  </Option>
                ))}
              </Select>
            )}
          </Item>
          <Item>
            <div className={cx('item-title')}>
              Target DNA sequence* (5' to 3', without PAM sequence)
            </div>
            {getFieldDecorator('rgenseq', {
              // initialValue: "ACCTCAGTTCCCCTTCAAAG",
              // initialValue: 'tattggaagaacttgcccac',
              rules: [
                { required: true, message: 'Please input target DNA sequence' }
              ]
            })(<Input placeholder='ACCTCAGTTCCCCTTCAAAG' />)}
          </Item>
          <Item>
            <div className={cx('item-title')}>Standard Range</div>
            {getFieldDecorator('end_range', {
              initialValue: '70',
              rules: [
                { required: true, message: 'Please input range' },
                { validator: checkNumber }
              ]
            })(<Input placeholder='Standard Range' />)}
          </Item>
          <Item>
            <div className={cx('item-title')}>Target Nucleotide</div>
            {getFieldDecorator('targetSeq', {
              // initialValue: "c",
              rules: [
                { required: true, message: 'Please input target' },
                { validator: validationCheck }
              ]
            })(
              <Radio.Group>
                {tideList.map(tide => (
                  <Radio key={tide} value={tide}>
                    {tide}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Item>
          <Item>
            <div className={cx('item-title')}>
              Desired change of target nucleotide
            </div>
            {getFieldDecorator('changeSeq', {
              // initialValue: "t",
              rules: [
                { required: true, message: 'Please input change' },
                { validator: validationCheck }
              ]
            })(
              <Radio.Group>
                {tideList.map(tide => (
                  <Radio key={tide} value={tide}>
                    {tide}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Item>
          <div className={cx('button-box')}>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Form>
      );
    }
  }
);
