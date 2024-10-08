import { z } from "zod";

// Define schema for "headers" with custom error messages
// const createSalesFormSchema = z.object({
//   channels: z.string({ required_error: "Please Select a channel Name" }),
//   fba_shipment_id:z.string({ required_error: "Please enter FBA Shipment" }),
//   fba_appointment_id:z.string({ required_error: "Please enter FBA Appointment" }),
//   hawb_number:z.string({ required_error: "Please enter HAWB number" }),
//   order_id:z.string({ required_error: "Please enter Order Id" }),
//   consignment_id:z.string({ required_error: "Please enter Consignment Id" }),
//   po_number:z.string({ required_error: "Please enter PO number" }),
//   blkt_vendor_code:z.string({ required_error: "Please enter Vendor Code" }),
//   place_of_supply:z.string({ required_error: "Please provide place of supply" }),
//   customer_address1:z.string({ required_error: "Please add your Billing Address Description must be between 10 and 100 characters" }),
//   customer_address2:z.string({ required_error: "Please add your Billing Address Description must be between 10 and 100 characters" }),
//   customer: z.string({ required_error: "Please select client Name" }),
//   customer_gstin: z.string({ required_error: "Please provide GST" }),
//   bill_to_label: z.string({ required_error: "" }),
//   bill_name:z.string(),
//   payment_term: z.string().optional(),
//   customer_branch: z.string({ required_error: "Please select Vendor Branch" }),
//   bill_id: z.string({ required_error: "Please select Billing Address" }),
//   billing_address: z.string({ required_error: "" }),
//   shipping_id: z.string({ required_error: "Please select Shipping Address" }),
//   shipping_address1: z.string({ required_error: "Please add your Shipping Address Description must be between 10 and 100 characters" }),
//   shipping_address2: z.string({ required_error: "Please add your Shipping Address Description must be between 10 and 100 characters" }),
//   shipping_state: z.string({ required_error: "Please select Shipping State" }),
//   isSameClientAdd: z.string({ required_error: "" }),
//   due_day: z.string().optional(),
//   terms_condition: z.string().optional(),
//   quotation_detail: z.string().optional(),
//   shipping_pinCode: z.string({ required_error: "Plenter Shipping Pincode" }),
//   shipping_pan: z.string({ required_error: "Plenter Shipping PAN Number" }),
//   shipping_gstin: z.string({ required_error: "Plenter Shipping GSTIN Number" }),
//   dispatch_pincode: z.string({ required_error: "" }),
//   pan: z.string({ required_error: "" }),
//   dispatch_gstin_uin: z.string({ required_error: "" }),
//   dispatch_address: z.string({ required_error: "" }),
//   // bill_from_address: z.string({ required_error: "" }),
//   bill_pan: z.string({ required_error: "Plenter Billing PAN Number" }),
//   bill_from_gst: z.string({ required_error: "Plenter Billing GSTIN Number" }),
//   billing_address1: z.string({ required_error: "Please add your Billing Address Description must be between 10 and 100 characters" }),
//   billing_address2: z.string({ required_error: "Please add your Billing Address Description must be between 10 and 100 characters" }),
//   project_id: z.string({ required_error: "" }),
//   project_description: z.string({ required_error: "" }),
//   // bill_to_gst: z.string({ required_error: "" }),
//   company:z.string({ required_error: "" }),
//   gstin:z.string({ required_error: "" }),
//   address:z.string({ required_error: "" }),
//   statecode:z.string({ required_error: "" }),
// });

const baseSchema = z.object({
  channel: z.string({ required_error: "Please select a channel name" }),
  bill_id: z.string({ required_error: "Please select  Address" }),
  billing_address1: z.string().min(10, {
    message:  "Please add your Address (Description must be between 10 and 100 characters)",
  }),
  billing_address2: z.string().min(10, {
    message:  "Please add your Address (Description must be between 10 and 100 characters)",
  }),
  bill_from_gst: z.string().min(15,{
    message: "Please enter GSTIN Number",
  }),
  bill_pan: z.string()
  .length(10, { message: "PAN Number must be exactly 10 characters" })
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Please enter a valid PAN Number (format: ABCDE1234F)",
  }),

  customer_address1: z.string().min(10, {
    message:
      "Please add your Address (Description must be between 10 and 100 characters)",
  }),
  customer_address2: z.string().min(10, {
    message:
      "Please add your Address (Description must be between 10 and 100 characters)",
  }),
  customer_gstin: z.string().min(15,{ message: "Please provide GST" }),
  isSameClientAdd: z.string().optional(),
  customer_branch: z.string({ required_error: "Please select Vendor Branch" }),
  // customr_branch:z.object({
  //   value: z.string({ required_error: "Customer Branch is required" }),
  //   label: z.string({ required_error: "Customer Branch is required" }),
  // }),
  shipping_gstin: z.string().min(15, {
    message: "Please enter Shipping GSTIN Number",
  }),
  shipping_pinCode: z.string()
  .min(6, {
    message: "Please enter Shipping Pincode",
  })
  .max(6, {
    message: "Shipping Pincode must be exactly 6 characters",
  }),

  shipping_id: z.string().min(1, { message: "Please select Shipping Address" }),
  shipping_address1: z.string().min(10, {
    message:
      "Please add your Shipping Address (Description must be between 10 and 100 characters)",
  }),
  shipping_address2: z.string().min(10, {
    message:
      "Please add your Shipping Address (Description must be between 10 and 100 characters)",
  }),
  shipping_state: z.string({ required_error: "Please select Shipping State" }),
  shipping_pan: z.string()
  .length(10, { message: "PAN Number must be exactly 10 characters" })
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Please enter a valid PAN Number (format: ABCDE1234F)",
  }),
  place_of_supply: z.string().min(1, {
    message: "Please provide place of supply",
  }),
  bill_name: z.string(),
  // Optional fields
  bill_to_label: z.string().optional(),
  terms_condition: z.string().optional(),
  due_day: z.string().optional(),
  quotation_detail: z.string().optional(),
  payment_term: z.string().optional(),
  comment: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
});

const channelSchemas = z.discriminatedUnion("channel", [
  z.object({
    channel: z.literal("BLK"),
    po_number: z.string().min(1, { message: "Please enter PO number" }),
    blkt_vendor_code: z.string().min(1, { message: "Please enter Vendor Code" }),
  }),
  z.object({
    channel: z.literal("AMZ"),
    amz_fba_ship_id: z.string().min(1,{ message: "Please enter FBA Shipment" }),
    amz_fba_app: z.string().min(1,{ message: "Please enter FBA Appointment" }),
    amz_hawb: z.string().optional(),
    customer: z.string().min(1,{ message: "Please select client Name" }),
  }),
  z.object({
    channel: z.literal("AMZ_IMP"),
    amz_fba_ship_id: z.string().min(1,{ message: "Please enter FBA Shipment" }),
    amz_fba_app: z.string().min(1,{ message: "Please enter FBA Appointment" }),
    customer: z.string().min(1,{ message: "Please select client Name" }),
    amz_hawb: z.string().min(1,{ message: "Please enter HAWB number" }),
  }),
  z.object({
    channel: z.literal("FLK"),
    flk_consg_id: z.string().min(1,{ message: "Please enter Consignment Id" }),
    customer: z.string().min(1,{ message: "Please select client Name" }),
  }),
  z.object({
    channel: z.literal("FLK_VC"),
    po_number: z.string().min(1,{ message: "Please enter PO number" }),
    customer: z.string().min(1,{ message: "Please select client Name" }),
  }),
  z.object({
    channel: z.literal("CROMA"),
    po_number: z.string().min(1,{ message: "Please enter PO number" }),
    customer: z.string().min(1,{ message: "Please select client Name" }),
  }),
  z.object({
    channel: z.literal("B2B"),
    b2b_order_id: z.string().min(1,{ message: "Please enter Order Id" }),
  }),
]);

const createSalesFormSchema = z.intersection(baseSchema, channelSchemas);

// Define schema for "materials" with custom error messages
const materialsSchema = z.object({
  so_type: z
    .array(z.string())
    .min(1, { message: "At least one SO Type is required" }),
  items: z.array(z.string()).optional().nullable(),
  qty: z.array(z.number()).optional().nullable(),
  hsn: z.array(z.string()).optional().nullable(),
  price: z.array(z.number()).optional().nullable(),
  gst_rate: z.array(z.number()).optional().nullable(),
  gst_type: z.array(z.string()).optional().nullable(),
  currency: z.array(z.string()).optional().nullable(),
  exchange_rate: z.array(z.number()).optional().nullable(),
  due_date: z.array(z.string()).optional().nullable(), // Ensure format validation as needed
  remark: z.array(z.string()).optional().nullable(),
});

export { createSalesFormSchema, materialsSchema };
