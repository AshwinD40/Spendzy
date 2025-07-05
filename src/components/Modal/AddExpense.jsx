import React from 'react'
import './style.css'
import { Button, Modal,Input, Form, DatePicker, Select } from 'antd'

function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancle,
  onFinish
}) {

  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancle}
      footer={null}
      className='custom-modal'
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          onFinish(values, "expense");
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
          <DatePicker format="YYYY-MM-DD" className='modal-input'/>
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
            <Select.Option value="transfers">Transfers</Select.Option>
            <Select.Option value="shopping">Shopping</Select.Option>
            <Select.Option value="foodanddining">Food & Dining</Select.Option>
            <Select.Option value="billsandrecharges">Bills & Recharges</Select.Option>
            <Select.Option value="personal">Personal</Select.Option>
            <Select.Option value="others">Other</Select.Option>
          </Select>
        
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-primary" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddExpense