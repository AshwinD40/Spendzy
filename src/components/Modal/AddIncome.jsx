import React from 'react'
import './style.css'
import { Button, Modal,Input, Form, DatePicker, Select } from 'antd'
import moment from 'moment';

function AddIncome({
  isIncomeModalVisible,
  handleIncomeCancle,
  onFinish
}) {

  const [form] = Form.useForm();
  return (
   <Modal
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancle}
      footer={null} 
      className='custom-modal'
      width={440}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
        }}
        className='custom-form'
      >
        <Form.Item
          style={{fontWeight:600}}
          name="name"
          label="Name"
          rules={[{ 
            required: true,
            message: 'Please enter a name'
          }]}
        >
          <Input type='text' className='modal-input'/>
        
        </Form.Item>
        <Form.Item
          style={{fontWeight:600}}
          name="amount"
          label="Amount"
          rules={[{ 
            required: true,
            message: 'Please input the income amount'
          }]}
        >
          <Input type='number' className='modal-input'/>
        
        </Form.Item>
        <Form.Item
          style={{fontWeight:600}}
          name="date"
          label="Date"
          rules={[{ 
            required: true,
            message: 'Please select the income date'
          }]}
        >
          <DatePicker format="YYYY-MM-DD" className='modal-input '/>
        </Form.Item>

        <Form.Item
          style={{fontWeight:600}}
          name="tag"
          label="Tag"
          rules={[{ 
            required: true,
            message: 'Please select a tag'
          }]}
        >
          <Select className='select-input'>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="papakepaise">Papa Ke paise</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-primary " type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddIncome