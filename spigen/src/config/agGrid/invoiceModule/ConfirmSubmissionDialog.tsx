import { Button, Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust the import path as needed

interface ConfirmSubmissionDialogProps {
  isDialogVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  invoiceId: string;
  form: FormInstance;
}

export function ConfirmSubmissionDialog({
  isDialogVisible,
  handleOk,
  handleCancel,
  invoiceId,
  form
}: ConfirmSubmissionDialogProps) {
  return (
    <Dialog open={isDialogVisible} onOpenChange={handleCancel}>
      <DialogContent
        className="min-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
        </DialogHeader>
        <Form form={form} layout="vertical">
          <p>Are you sure you want to submit this Debit Note?</p>
          <Form.Item
            name="invoiceId"
            label="Invoice ID"
            initialValue={invoiceId}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="otherRef"
            label="Other Ref"
            rules={[{ required: true, message: "Please enter other reference!" }]}
          >
            <Input placeholder="Enter other reference here" />
          </Form.Item>
        </Form>
        <DialogFooter>
          <Button type="default" onClick={handleCancel} className="mr-2">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
