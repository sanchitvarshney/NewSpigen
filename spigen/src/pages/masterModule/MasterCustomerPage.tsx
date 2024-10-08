import React, { useEffect, useMemo } from "react";
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
import { clientFormSchema } from "@/schema/masterModule/customerSchema";
import ReusableTable from "@/components/shared/ReusableTable";
import columnDefs from "@/config/agGrid/mastermodule/CustomerTable";
import { transformCustomerTableData } from "@/helper/TableTransformation";
import ClientActionCellRender from "@/config/agGrid/mastermodule/ClientActionCellRender";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/store";
import { createClient, fetchchannelList, fetchClientList } from "@/features/client/clientSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import { Tooltip } from "antd";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { fetchCountries, fetchStates } from "@/features/salesmodule/createSalesOrderSlice";


const MasterCustomerPage: React.FC<any> = (props: any) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { channelList,loading } = useSelector((state: RootState) => state.client);
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      channel: "",
      clientName: "",
      panNo: "",
      mobileNo: "",
      phone: "",
      email: "",
      website: "",
      salesPersonName: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof clientFormSchema>) => {
    try {
      const resultAction = await dispatch(
        createClient({
          endpoint: "/client/add",
          payload: {
            client_channel: values.channel,
            clientName: values.clientName,
            phone: values.phone || "",
            panNo: values.panNo,
            mobileNo: values.mobileNo,
            email: values.email || "",
            website: values.website || "",
            salesPersonName: values.salesPersonName || "",
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
        form.reset();
        dispatch(fetchClientList());
      } else {
        toast({
          title:
            typeof resultAction.message === "string"
              ? resultAction.message
              : JSON.stringify(resultAction.message),
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const TruncateCellRenderer = (props: any) => {
    const style = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%", // Ensure the width of the cell
      display: "block", // Ensure that the content respects the overflow
    };

    return (
      <Tooltip title={props.value} placement="top">
        <div style={style}>{props.value}</div>
      </Tooltip>
    );
  };
  const components = useMemo(
    () => ({
      actionsCellRenderer: ClientActionCellRender,
      statusCellRenderer: (params: any) => {
        return <Badge className="bg-green-600">{params.data.status}</Badge>;
      },
      truncateCellRenderer: TruncateCellRenderer,
    }),
    []
  );

  useEffect(() => {
    dispatch(fetchchannelList());
    dispatch(fetchClientList());
    dispatch(fetchCountries());
    dispatch(fetchStates());
  }, []);

  return (
    <div className="h-[calc(100vh-50px)] grid grid-cols-[450px_1fr]">
      {loading && <FullPageLoading />}
      <div className="h-[calc(100vh-50px)] overflow-y-auto bg-white">
        {props?.module === "salesorder" && (
          <h3 className="text-[17px] text-slate-600 font-[600]">
            Add Bill To Details
          </h3>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-[10px] py-[20px]"
          >
            <div className="grid grid-cols-1 gap-[10px]">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem className="border-b border-black">
                    <FormLabel className={LableStyle}>
                      Channel{" "}
                      <span className="pl-1 text-red-500 font-bold">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="border-0 focus:outline-none focus:ring-0">
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            form.setValue("channel", value)
                          }
                        >
                          <SelectTrigger className="border-0 focus:outline-none focus:ring-0">
                            <SelectValue placeholder="Select a filter type" />
                          </SelectTrigger>
                          <SelectContent className="border-0 focus:outline-none focus:ring-0">
                            {channelList.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
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
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LableStyle}>
                    Client Name{" "}
                    <span className="pl-1 text-red-500 font-bold">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Client Name"
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
              name="salesPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LableStyle}>
                    Sales Person Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Sales Person Name"
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
                name="panNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>
                      PAN Number{" "}
                      <span className="pl-1 text-red-500 font-bold">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter PAN Number"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LableStyle}>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Email"
                      {...field}
                      className={InputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-[10px]">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Phone </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Phone"
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
                      Mobile Number{" "}
                      <span className="pl-1 text-red-500 font-bold">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Mobile Number"
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LableStyle}>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Website URL"
                      {...field}
                      className={InputStyle}
                    />
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
      <div className={props.module === "salesorder" ? "pt-10" : "pt-0"}>
        <ReusableTable
          components={components}
          heigth="h-[calc(100vh-50px)]"
          endpoint="/client/getClient"
          columns={columnDefs}
          transform={transformCustomerTableData}
          method="get"
        />
      </div>
    </div>
  );
};

export default MasterCustomerPage;
