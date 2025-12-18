import React from "react";
import { Modal, Input, Form, DatePicker, Select } from "antd";
import GlassSelect from "../Common/GlassSelector";

function AddIncome({
  isIncomeModalVisible,
  handleIncomeCancle,
  onFinish
}) {
  const [form] = Form.useForm();

  const incomeOptions = [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "papakepaise", label: "Papa Ke Paise" },
    { value: "other", label: "Other" }
  ];


  return (
    <Modal
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancle}
      footer={null}
      centered
      className="!w-[440px]"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-white">
            Add Income
          </h2>
          <p className="text-sm text-gray-300">
            Record money coming in
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
          onFinish(values, "income");
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
            placeholder="Salary / Freelance"
            className="
              !bg-white/10
              !border-white/20
              !text-white
              placeholder:!text-gray-400
              rounded-xl px-4 py-2.5
              focus:!border-emerald-400/60
              focus:!shadow-[0_0_0_3px_rgba(52,211,153,0.25)]
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
            placeholder="50000"
            className="
              !bg-white/10
              !border-white/20
              !text-white
              placeholder:!text-gray-400
              rounded-xl px-4 py-2.5
              focus:!border-emerald-400/60
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

        <Form.Item
          name="tag"
          rules={[{ required: true, message: "Select a category" }]}
        >
          <GlassSelect 
            label="Category"
            value={form.getFieldValue("tag")}
            onChange={(val) =>  form.setFieldValue("tag", val)}
            options={incomeOptions}
            accent="emerald"
          />
        </Form.Item>



        {/* Submit */}
        <Form.Item className="pt-2">
          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-semibold
              bg-emerald-500/25 text-emerald-200
              border border-emerald-400/30
              backdrop-blur-xl
              transition-all duration-300
              hover:bg-emerald-500/35
              hover:shadow-[0_12px_45px_rgba(52,211,153,0.35)]
              hover:scale-[1.02]
            "
          >
            Add Income
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncome;
