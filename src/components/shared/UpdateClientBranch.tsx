import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateBranchAddressSchema } from "@/schema/masterModule/customerSchema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { default as Select2 } from "react-select";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/store";
import { updateBranch } from "@/features/client/branchSlice";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import styled from "styled-components";
import {
  fetchCountries,
  fetchStates,
} from "@/features/salesmodule/createSalesOrderSlice";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { transformPlaceData } from "@/helper/transform";
interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  params: any;
  data: any;
}
const MasterClientBranch: React.FC<Props> = (props: Props) => {
  const { open, onClose, data } = props;
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { countries, states } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const form = useForm<z.infer<typeof updateBranchAddressSchema>>({
    resolver: zodResolver(updateBranchAddressSchema),
    defaultValues: {
      state: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pinCode: "",
      phoneNo: "",
      gst: "",
      useAsShipmentAddress: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("label", data?.label);
      form.setValue("country", data?.country?.value);
      form.setValue("state", data?.state?.value);
      form.setValue("city", data?.city);
      form.setValue("pinCode", data?.pinCode);
      form.setValue("phoneNo", data?.phoneNo);
      form.setValue("email", data?.email);
      form.setValue("gst", data?.gst);
      form.setValue("addressLine1", data?.addressLine1);
      form.setValue("addressLine2", data?.addressLine2);
      form.setValue(
        "useAsShipmentAddress",
        data?.useAsShipmentAddress || false
      );
      form.setValue("shipmentAddress.label", data?.shipmentAddress?.Label);
      form.setValue("shipmentAddress.company", data?.shipmentAddress?.Company);
      form.setValue(
        "shipmentAddress.country",
        data?.shipmentAddress?.Country?.value
      );
      form.setValue(
        "shipmentAddress.state",
        data?.shipmentAddress?.State?.value
      );
      form.setValue("shipmentAddress.pinCode", data?.shipmentAddress?.Pin);
      form.setValue("shipmentAddress.pan", data?.shipmentAddress?.Pan);
      form.setValue(
        "shipmentAddress.addressLine1",
        data?.shipmentAddress?.Address1
      );
      form.setValue(
        "shipmentAddress.addressLine2",
        data?.shipmentAddress?.Address2
      );
      form.setValue("shipmentAddress.gst", data?.shipmentAddress?.Gstin);
    }
  }, [data, dispatch]);

  const copyAddressToShipment = () => {
    const { addressLine1, addressLine2, state, country, pinCode, gst, label } =
      form.getValues();

    form.setValue("shipmentAddress.label", label ?? "");
    form.setValue("shipmentAddress.country", country ?? "");
    form.setValue("shipmentAddress.state", state ?? "");
    form.setValue("shipmentAddress.pinCode", pinCode ?? "");
    form.setValue("shipmentAddress.gst", gst ?? "");
    form.setValue("shipmentAddress.addressLine1", addressLine1 ?? "");
    form.setValue("shipmentAddress.addressLine2", addressLine2 ?? "");
    form.setValue("useAsShipmentAddress", true);
  };

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchStates());
  }, []);

  const onSubmit = async (
    values: z.infer<typeof updateBranchAddressSchema>
  ) => {
    try {
      const resultAction = await dispatch(
        updateBranch({
          endpoint: "/client/updateBranch",
          payload: {
            ...values,
            shipmentAddress: {
              ...values.shipmentAddress,
              clientCode: data?.clientCode,
            },
            same_shipping_address: values.useAsShipmentAddress,
            status: "active",
            addressID: data?.addressID,
            clientCode: data?.clientCode,
          },
        })
      ).unwrap();

      if (resultAction.code === 200) {
        toast({
          title:
            typeof resultAction.message === "string"
              ? resultAction.message
              : JSON.stringify(resultAction.message),
          className: "bg-green-600 text-white items-center",
        });
      }
      onClose(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  console.log(form.formState.errors);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="min-w-[60%] max-h-[100vh] overflow-y-auto flex flex-col"
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-slate-600">
            Update Branch: {data?.addressID}
          </SheetTitle>
        </SheetHeader>

        <div className="pt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-4 gap-[20px]">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Lable/Wharehouse/FC Code/DC{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Lable/Wharehouse/FC Code/DC"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormField
                    control={form.control}
                    name="country"
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Country
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select2
                            styles={customStyles}
                            placeholder="Country"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="shipping_state"
                            options={
                              Array.isArray(countries)
                                ? transformPlaceData(countries)
                                : []
                            } // Ensure states is an array
                            onChange={(e: any) => {
                              form.setValue("country", e.value);
                            }}
                            value={
                              Array.isArray(countries)
                                ? transformPlaceData(countries)?.find(
                                    (state: any) => {
                                      const currentValue =
                                        form.getValues("country");
                                      return state.value === currentValue;
                                    }
                                  )
                                : null // Set to null if states is not an array
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="state"
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          State
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select2
                            styles={customStyles}
                            placeholder="State"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="state"
                            options={
                              Array.isArray(states)
                                ? transformPlaceData(states)
                                : []
                            } // Ensure states is an array
                            onChange={(e: any) => {
                              form.setValue("state", e.value);
                            }}
                            value={
                              Array.isArray(states)
                                ? transformPlaceData(states)?.find(
                                    (state: any) => {
                                      const currentValue =
                                        form.getValues("state");
                                      return state.value === currentValue;
                                    }
                                  )
                                : null // Set to null if states is not an array
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>City </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        GST Number{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GST Number"
                          {...field}
                          className={InputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>PIN Code </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          type="number"
                          placeholder="PIN Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Phone Number{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          type="number"
                          placeholder="Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Email </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-[20px]">
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Address Line 1{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={100}
                          className={InputStyle}
                          placeholder="Address Line 1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Address Line 2{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={100}
                          className={InputStyle}
                          placeholder="Address Line 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="border-b-[1px] border-slate-300"></div>
              <div className="my-[20px]">
                <h3 className="text-[17px] text-slate-600 font-[600]">
                  Map Ship Address
                </h3>
                <FormField
                  control={form.control}
                  name="useAsShipmentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch className="flex items-center gap-[10px]">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e: any) => {
                                form.setValue(
                                  "useAsShipmentAddress",
                                  e.target.checked
                                );
                                copyAddressToShipment();
                              }}
                            />
                            <span className="slider"></span>
                          </label>
                          <p className="text-slate-600 text-[13px]">
                            Same as Bill To
                          </p>
                        </Switch>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <p className="text-[14px]"></p> */}
                {/* <Switch onChange={copyAddressToShipment} /> */}
              </div>
              <div className="grid grid-cols-4 gap-[20px]">
                <FormField
                  control={form.control}
                  name="shipmentAddress.label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Lable/Wharehouse/FC Code/DC{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Lable/Wharehouse/FC Code/DC"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipmentAddress.company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Company
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormField
                    control={form.control}
                    name="shipmentAddress.country"
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Country
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select2
                            styles={customStyles}
                            placeholder="Country"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="shipping_state"
                            options={
                              Array.isArray(countries)
                                ? transformPlaceData(countries)
                                : []
                            } // Ensure states is an array
                            onChange={(e: any) => {
                              form.setValue("shipmentAddress.country", e.value);
                            }}
                            value={
                              Array.isArray(countries)
                                ? transformPlaceData(countries)?.find(
                                    (state: any) => {
                                      const currentValue = form.getValues(
                                        "shipmentAddress.country"
                                      );
                                      return state.value === currentValue;
                                    }
                                  )
                                : null // Set to null if states is not an array
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="shipmentAddress.state"
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          State
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select2
                            styles={customStyles}
                            placeholder="State"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="shipmentAddress.state"
                            options={
                              Array.isArray(states)
                                ? transformPlaceData(states)
                                : []
                            } // Ensure states is an array
                            onChange={(e: any) => {
                              form.setValue("shipmentAddress.state", e.value);
                            }}
                            value={
                              Array.isArray(states)
                                ? transformPlaceData(states)?.find(
                                    (state: any) => {
                                      const currentValue = form.getValues(
                                        "shipmentAddress.state"
                                      );
                                      return state.value === currentValue;
                                    }
                                  )
                                : null // Set to null if states is not an array
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="shipmentAddress.pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        PIN Code
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          type="number"
                          placeholder="PIN Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipmentAddress.pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        PAN Number{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="PAN Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipmentAddress.gst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        GST Number{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GST Number"
                          {...field}
                          className={InputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-[20px]">
                <FormField
                  control={form.control}
                  name="shipmentAddress.addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Address Line 1{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={100}
                          className={InputStyle}
                          placeholder="Address Line 1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipmentAddress.addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Address Line 2{" "}
                        <span className="pl-1 text-red-500 font-bold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={100}
                          className={InputStyle}
                          placeholder="Address Line 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch className="flex items-center gap-[10px]">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={field.value || true}
                            onChange={(e: any) => {
                              form.setValue("status", e.target.checked);
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                        <p className="text-slate-600 text-[13px]">Active</p>
                      </Switch>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Switch = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 2.8em;
    height: 18px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    border-radius: 20px;
    left: 2px;
    bottom: 1.5px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #0891b2;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #0891b2;
  }

  input:checked + .slider:before {
    transform: translateX(1.7em);
  }
`;

export default MasterClientBranch;
