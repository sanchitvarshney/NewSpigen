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
import { clientEditFormSchema } from "@/schema/masterModule/customerSchema";
import ReusableAsyncSelect from "./ReusableAsyncSelect";
import { transformClientTds } from "@/helper/transform";
import {
  MasterCustomer,
  Props,
} from "@/types/masterModule/masterCustomerTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import styled from "styled-components";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchClient, updateClient } from "@/features/client/clientSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store";
import { InputStyle, LableStyle } from "@/constants/themeContants";
const MasterClientEdit: React.FC<Props> = ({
  uiState,
}: {
  uiState: MasterCustomer;
}) => {
  const { clientEdit, setClientEdit, clientId } = uiState;
  const { toast } = useToast();
  const dispatch = useDispatch();

  const clientData = useSelector(
    (state: any) =>
      state.client.data.find((client: any) => client?.code === clientId) || {}
  );
  const { channelList } = useSelector((state: RootState) => state.client);

  const form = useForm<z.infer<typeof clientEditFormSchema>>({
    resolver: zodResolver(clientEditFormSchema),
    defaultValues: {
      active: false,
    },
  });

  useEffect(() => {
    if (clientEdit && clientId) {
      dispatch(fetchClient({ code: clientId }) as any);
    }
  }, [clientEdit, clientId, dispatch]);

  useEffect(() => {
    if (clientData && clientData.code === clientId) {
      form.reset({
        client_channel: clientData.client_channel,
        clientName: clientData.name,
        email: clientData.email,
        panNo: clientData.panNo,
        mobileNo: clientData.mobile,
        salePerson: clientData.salesPerson,
        website: clientData.website,
        clientTDS: clientData.tds?.[0],
        clientTCS: clientData.tcs?.[0],
        active: clientData.status === "active",
      });
    }
  }, [clientData, clientId, form]);
console.log(uiState)
  const onSubmit = (value: any) => {
    const payload = {
      ...value,
      code: clientId,
      status: value.active ? "active" : "inactive",
    };
    dispatch(updateClient({ endpoint: `/client/update`, payload }) as any);
    uiState.setClientBranch(false);
    toast({
      title: "Client updated successfully",
      className: "bg-green-600 text-white items-center",
    });

    setClientEdit(false);
  };

  return (
    <Sheet open={clientEdit} onOpenChange={setClientEdit}>
      <SheetContent
        className="min-w-[50%]"
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>Update Bill To Details: {clientId}</SheetTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-[10px]">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Client Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Vendor Name"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            className={InputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-[10px]">
                    <FormField
                      control={form.control}
                      name="client_channel"
                      render={({ field }) => (
                        <FormItem className="border-b border-black">
                          <FormLabel className={LableStyle}>
                            Channel{" "}
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="border-0 focus:outline-none focus:ring-0">
                              <Select
                                value={field.value}
                                onValueChange={(value) =>
                                  form.setValue("client_channel", value)
                                }
                              >
                                <SelectTrigger className="border-0 focus:outline-none focus:ring-0">
                                  <SelectValue placeholder="Select a filter type" />
                                </SelectTrigger>
                                <SelectContent className="border-0 focus:outline-none focus:ring-0">
                                  {channelList.map((item) => (
                                    <SelectItem
                                      key={item.code}
                                      value={item.code}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="panNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>PAN Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="PAN Number"
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
                    name="mobileNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Mobile{" "}
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Mobile"
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
                    name="salePerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Sale Person
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sale Person"
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
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Website"
                            {...field}
                            className={InputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="clientTDS"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Client TDS</FormLabel>
                      <FormControl>
                        <ReusableAsyncSelect
                          placeholder="Client TDS"
                          endpoint="vendor/getAllTds"
                          transform={transformClientTds}
                          fetchOptionWith="query"
                          onChange={(e: any) =>
                            form.setValue("clientTDS", e.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientTCS"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Client TCS</FormLabel>
                      <FormControl>
                        <ReusableAsyncSelect
                          placeholder="Client TCS"
                          endpoint="/tally/tcs/getAllTcs"
                          transform={transformClientTds}
                          fetchOptionWith="query"
                          onChange={(e: any) =>
                            form.setValue("clientTCS", e.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch className="flex items-center gap-[10px]">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e: any) =>
                                form.setValue("active", e.target.checked)
                              }
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
        </SheetHeader>
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

export default MasterClientEdit;
