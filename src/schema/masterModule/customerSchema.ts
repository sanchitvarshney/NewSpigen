import { z } from "zod";

export const clientFormSchema = z.object({
  channel: z.string({ required_error: "Channel is required" }),
  clientName: z.string().min(1, { message: "Client Name is required" }),
  salesPersonName: z.string().optional(),
  panNo: z.string().min(1, { message: "PAN Number is required" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  mobileNo: z.string().min(1, { message: "Mobile Number is required" }),
  website: z.string().optional(),
});

export const clientEditFormSchema = z.object({
  clientName: z.string().min(1, "Vendor Name is required"),
  client_channel: z.string({ required_error: "Channel is required" }),
  email: z.string().email("Invalid email address").optional(),
  panNo: z.string().min(1, "PAN Number is required"),
  mobileNo: z.string().min(1, "Mobile number is required"),
  salePerson: z.string().optional(),
  website: z.string().optional(),
  clientTDS: z.string().optional(),
  clientTCS: z.string().optional(),
  active: z.boolean().optional(),
});

export const branchAddressSchema = z.object({
  label: z.string({ required_error: "Label is required" }),
  country: z.string({ required_error: "Country is required" }),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pinCode: z.string().min(6, {
    message: "Please enter Pincode",
  })
  .max(6, {
    message: "Pincode must be exactly 6 characters",
  }),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().min(1, "Address is required"),
  phoneNo: z.string().min(1, "Phone Number is required"),
  gst: z.string().min(1, "GST Number is required"),
  useAsShipmentAddress: z.boolean(),
  status: z.string().optional(),
  shipmentAddress: z.object({
    label: z.string({ required_error: "Label is required" }),
    country: z.string().min(1, "Country is required"),
    company: z.string().min(1, "Company is required"),
    state: z.string().min(1, "State is required"),
    pinCode: z.string().min(6, {
      message: "Please enter Pincode",
    })
    .max(6, {
      message: "Pincode must be exactly 6 characters",
    }),
    pan:  z.string()
    .length(10, { message: "PAN Number must be exactly 10 characters" })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Please enter a valid PAN Number (format: ABCDE1234F)",
    }),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().min(1, "Address is required"),
    gst: z.string().min(1, "GST Number is required"),
  }),
});

export const updateBranchAddressSchema = z.object({
  label: z.string({ required_error: "Label is required" }),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().min(6, {
    message: "Please enter Pincode",
  })
  .max(6, {
    message: "Pincode must be exactly 6 characters",
  }).optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  phoneNo: z.string().optional(),
  gst: z.string().optional(),
  email: z.string().optional(),
  status: z.boolean().optional(),
  useAsShipmentAddress: z.boolean().optional(),
  shipmentAddress: z.object({
    label: z.string({ required_error: "Label is required" }),
    country: z.string().min(1, "Country is required"),
    company: z.string().min(1, "Company is required"),
    state: z.string().min(1, "State is required"),
    pinCode: z.string().min(6, {
      message: "Please enter Pincode",
    })
    .max(6, {
      message: "Pincode must be exactly 6 characters",
    }),
    pan:  z.string()
    .length(10, { message: "PAN Number must be exactly 10 characters" })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Please enter a valid PAN Number (format: ABCDE1234F)",
    }),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().min(1, "Address is required"),
    gst: z.string().min(1, "GST Number is required"),
  }),
});

export const updateBranchSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  gst: z.string().min(1, "GST Number is required"),
  pin: z.string().min(1, "Pin is required"),
  phone: z.number().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address").optional(),
  address: z.string().min(1, "Address is required"),
  active: z.boolean(),
});
