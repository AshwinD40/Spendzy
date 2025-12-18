import React from "react";
import { Modal, Input, Form, DatePicker } from "antd";
import GlassSelect from "../Common/GlassSelector";

function AddExpense({
  isExpenseModalVisible,
  handleExpenseCancle,
  onFinish
}) {
  const [form] = Form.useForm();

  const expenseOptions = [
    { value: "food", label: "Food" },
    { value: "entertainment", label: "Entertainment" },
    { value: "bills", label: "Bills" },
    { value: "shopping", label: "Shopping" },
    { value: "transportation", label: "Transportation" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" }
  ];

  return (
    <Modal
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancle}
      footer={null}
      centered
      className="!w-[440px]"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-white">
            Add Expense
          </h2>
          <p className="text-sm text-gray-300">
            Track where your money goes
          </p>
        </div>
      }
      styles={{
         header: {
          background: "transparent",
          borderBottom: "none",
          paddingBottom: "0"
        },
        content: {
          background: "rgba(20,20,20,0.9)",
          backdropFilter: "blur(28px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)"
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4 space-y-4"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<span className="text-gray-200 text-sm">Name</span>}
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input
            placeholder="Groceries"
            className="
              !bg-white/10
              !border-white/20
              !text-white
              placeholder:!text-gray-400
              rounded-xl px-4 py-2.5
              focus:!border-rose-400/60
              focus:!shadow-[0_0_0_3px_rgba(244,63,94,0.25)]
            "
          />
        </Form.Item>

        {/* Amount */}
        <Form.Item
          name="amount"
          label={<span className="text-gray-200 text-sm">Amount</span>}
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input
            type="number"
            placeholder="1200"
            className="
              !bg-white/10
              !border-white/20
              !text-white
              placeholder:!text-gray-400
              rounded-xl px-4 py-2.5
              focus:!border-rose-400/60
            "
          />
        </Form.Item>

        {/* Date */}
        <Form.Item
          name="date"
          label={<span className="text-gray-200 text-sm">Date</span>}
          rules={[{ required: true, message: "Select a date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            className="
              !w-full
              !bg-white/10
              !border-white/20
              !text-white
              rounded-xl px-4 py-2
            "
          />
        </Form.Item>

        {/* Tag */}
        <Form.Item
          name="tag"
          rules={[{ required: true, message: "Select a category" }]}
        >
          <GlassSelect 
            label="Category"
            value={form.getFieldValue("tag")}
            onChange={(val) =>  form.setFieldValue("tag", val)}
            options={expenseOptions}
            accent="rose"
          />
        </Form.Item>

        {/* Submit */}
        <Form.Item className="pt-2">
          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-semibold
              bg-rose-500/25 text-rose-200
              border border-rose-400/30
              backdrop-blur-xl
              transition-all duration-300
              hover:bg-rose-500/35
              hover:shadow-[0_12px_45px_rgba(244,63,94,0.35)]
              hover:scale-[1.02]
            "
          >
            Add Expense
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpense;
